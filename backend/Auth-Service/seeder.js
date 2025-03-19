const mongoose = require('mongoose');
const User = require('./Models/User'); 
require('dotenv').config();

const users = [
  { username: 'Ali Zahran', email: 'ali.zahran@example.com', password: 'password123', role: 'admin' },
  { username: 'Fatima Al-Sayed', email: 'fatima.alsayed@example.com', password: 'password123', role: 'member' },
  { username: 'Ahmed El-Masri', email: 'ahmed.elmasri@example.com', password: 'password123', role: 'guest' },
  { username: 'Mariam Fathy', email: 'mariam.fathy@example.com', password: 'password123', role: 'admin' },
  { username: 'Omar El-Haddad', email: 'omar.elhaddad@example.com', password: 'password123', role: 'member' },
  { username: 'Layla Hamza', email: 'layla.hamza@example.com', password: 'password123', role: 'guest' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    
    await User.deleteMany({});
    
    
    await User.insertMany(users);
    console.log('Seeder: Data inserted successfully');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error:', err);
    mongoose.connection.close();
  });
