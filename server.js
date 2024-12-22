const express = require('express');
const app = express();
const hbs = require('hbs');
const nocache = require('nocache');
const session = require('express-session');

// Middleware and Configuration
app.use(express.static('public'));
app.set('view engine', 'hbs');

// Predefined credentials (for testing only)
const username = "admin";
const password = "123";
  
// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

// Prevent caching
app.use(nocache());

// Routes

// Root Route
app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user });
    } else {
        const msg = req.session.passwordwrong ? "incorrect bro" : "";
        req.session.passwordwrong = false; // Reset the error flag
        res.render('login', { msg });
    }
});

// Verify Login Credentials
app.post('/verify', (req, res) => {
    console.log(req.body);

    if (req.body.username === username && req.body.password === password) {
        req.session.user = req.body.username; // Store user in session
        res.redirect('/home');
    } else {
        req.session.passwordwrong = true; // Set error flag
        res.redirect('/');
    }
});

// Home Route
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user });
    } else {
        res.redirect('/'); // Redirect unauthenticated users to login
    }
});

// Logout Route
// Logout Route (only accepts POST)
app.post('/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/'); // Redirect to login
});


// Start the Server
app.listen(5003, () => console.log('Server running on port 5003'));