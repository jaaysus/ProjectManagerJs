require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
app.use(cors());
app.use(express.json());

const project_DB=process.env.PROJECT_DB; // Project_DB
const port=parseInt(process.env.PROJECT_PORT); //3000
const url=process.env.MONGOOSE_URL; 

mongoose.connect(url+project_DB)
.then(()=>console.log('Your Connexion To MongoDB Is Successful (❁´◡`❁)'))
.catch((error)=>console.error('Error connecting to mongodb',error));
const db=mongoose.connection;

const ProjectsRoutes=require('./Routes/Project');
app.use('/',ProjectsRoutes);

app.listen(port,()=>{
    console.log(`The server now executing on port ${port}`);
});