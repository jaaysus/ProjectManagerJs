require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
// const cors=require('cors');
// app.use(cors());
app.use(express.json());

const user_DB=process.env.USER_DB; 
const port=parseInt(process.env.PORT); 
const url=process.env.MONGOOSE_URL; 
console.log(user_DB)
mongoose.connect(url+user_DB)
.then(()=>console.log('Your Connexion To MongoDB Is Successful (❁´◡`❁)'))
.catch((error)=>console.error('Error connecting to mongodb',error));
const db=mongoose.connection;

const UserRoutes=require('./Routes/auth');
app.use('/users',UserRoutes);

app.listen(port,()=>{
    console.log(`The server now executing on port ${port}`);
});