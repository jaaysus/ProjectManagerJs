const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');

mongoose.connect('mongodb://localhost:27017/User_DB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedUsers = async () => {
  try {
    await User.deleteMany(); // Clear existing users

    const users = [
      {
        username: "kuro",
        email: "kuro@gmail.com",
        password: await bcrypt.hash("password123", 10),
        role: "admin"
      },
      {
        username: "kibo",
        email: "kibo@gmail.com",
        password: await bcrypt.hash("password1234", 10),
        role: "membre"
      },
      {
        username: "shiro",
        email: "shiro@gmail.com",
        password: await bcrypt.hash("password123", 10),
        role: "membre"
      }
    ];

    await User.insertMany(users);
    console.log("Seeder executed successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeder error:", error);
    mongoose.connection.close();
  }
};

seedUsers();
