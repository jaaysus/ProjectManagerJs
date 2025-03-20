const mongoose = require('mongoose');
require('dotenv').config();

const connectDB=()=>{mongoose.connect('mongodb://localhost:27017/Task_DB')
.then(()=>console.log('Your Connexion To MongoDB Is Successful (❁´◡`❁)'))
.catch((error)=>console.error('Error connecting to mongodb',error));}
const db=mongoose.connection;

module.exports = connectDB;

