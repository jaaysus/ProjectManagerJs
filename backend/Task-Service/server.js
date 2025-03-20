require('dotenv').config();  // Charge .env en premier !
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

connectDB();

const tasksRoutes=require('./routes/taskRoutes');
app.use('/',tasksRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
