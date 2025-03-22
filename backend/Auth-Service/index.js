const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const UserRoute = require('./Routes/auth'); 
app.use(express.json());
const PORT = process.env.PORT || 3000;
const URL_MONGOOSE = process.env.URL_MONGOOSE;
const DBNAME = process.env.DBNAME;
mongoose.connect(`mongodb://localhost:27017/PROJECT_DB`)
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));
const UserRoute=require('./Routes/auth');
app.use('/user',UserRoute);
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

