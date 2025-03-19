const express = require('express');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};


router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const users = await User.find().select('-password');
  res.status(200).json(users);
});


router.get('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(user);
});


router.post('/create', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { username, email, password, role } = req.body;
  const user = new User({ username, email, password, role });
  await user.save();
  res.status(201).json({ message: 'User created successfully' });
});


router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  
  const { username, email, password } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { username, email, password },  
    { new: true }
  ).select('-password');

  if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(updatedUser);
});


router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.status(200).json({ message: 'User deleted successfully' });
});


router.put('/block/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.blocked = true;
  await user.save();
  res.status(200).json({ message: 'User blocked successfully' });
});


router.put('/unblock/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.blocked = false;
  await user.save();
  res.status(200).json({ message: 'User unblocked successfully' });
});


router.get('/search', verifyToken, async (req, res) => {
  const { name, email, role } = req.query;
  let query = {};

  if (name) query.username = { $regex: name, $options: 'i' }; 
  if (email) query.email = { $regex: email, $options: 'i' }; 
  if (role) query.role = role;

  
  const users = await User.find(query).select('-password');
  res.status(200).json(users);
});

module.exports = router;
