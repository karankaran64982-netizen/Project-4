require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const pagesRouter = require('./routes/pages');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const { requestLogger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine (server-side rendering)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core middleware
app.use(express.urlencoded({ extended: true })); // parse form submissions
app.use(express.json()); // parse JSON API bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(requestLogger); // custom logging middleware -> data/requests.log

app.use(session({
  secret: process.env.SESSION_SECRET || 'foodie-market-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 }
}));

// Make cart & logged-in user available to every view
app.use((req, res, next) => {
  req.session.cart = req.session.cart || [];
  res.locals.cart = req.session.cart;
  res.locals.user = req.session.user || null;
  next();
});

// Rate limiting for the public API (Task 7: advanced API features)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

// Routes
app.use('/', pagesRouter);
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', {
    title: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Foodie Market running at http://localhost:${PORT}`);
});
