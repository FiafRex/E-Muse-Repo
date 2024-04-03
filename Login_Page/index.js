// index.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/User'); // Import User model

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/btest', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(express.static(__dirname + '/public')); // Serve static files from the public directory
app.use(express.json());

// Middleware to disable caching for the login page
app.use('/', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Route to serve login.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Login and Signup Endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid username or password');
    }

    req.session.userId = user._id;
    console.log(`${username} has logged in!`);
    return res.redirect('/landing');
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    console.log('New user signed up:', newUser.username);

    // Redirect with success message
    return res.redirect('/?message=Signup successful! Please log in.');
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// Logout Endpoint
app.post('/logout', (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logout successful' }); // Send a success JSON response
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Landing Page
app.get('/landing', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/'); // Redirect to login if user not logged in
  }
  res.sendFile(__dirname + '/public/landing.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
