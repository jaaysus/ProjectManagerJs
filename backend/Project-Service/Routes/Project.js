const express=require('express');
const router=express.Router();
const Project=require('../Models/Project');

router.get('/',(req,res)=>{
    const projects=Project.find();
    try{
        res.json(projects);
    }catch(error){
        res.status(500).send('There was an error fetching the projects');
    }
});

module.exports=router;