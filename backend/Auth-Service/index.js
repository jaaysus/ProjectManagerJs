const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/user');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 

mongoose.connect(process.env.MONGO_URI)  // Removed the deprecated options
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
