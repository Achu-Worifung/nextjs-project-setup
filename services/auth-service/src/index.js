const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/login', (req, res) => {
  // Add your login logic here
  const user = { /* user data */ };
  const token = jwt.sign(user, process.env.JWT_SECRET);
  res.json({ token });
});

app.post('/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
});
