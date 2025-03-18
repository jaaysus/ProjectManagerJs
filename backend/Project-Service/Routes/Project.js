const express=require('express');
const router=express.Router();
const Project=require('../Models/Project');

router.get('/',async(req,res)=>{
    const projects=await Project.find();
    try{
        res.json(projects);
    }catch(error){
        res.status(500).send('There was an error fetching the projects');
    }
});

router.post('/add',(req,res)=>{
    const{name,description,startDate,endDate,category,status}=req.body;
    if(!name){
        res.send('The name field is required!');
    }
    const newProject=new Project(req.body);
    try{
        newProject.save();
        res.json(newProject);
    }catch(error){
        res.status(505).json({message:'There was an error saving the new project',error:error});
    }
});

router.put('/:id',(req,res)=>{
    const id=req.params.id;
    try{
        const ModifiedProject=Project.updateOne({_id:id});
        res.json(ModifiedProject);
    }catch(error){
        res.status(500).send('There was an error editing the project');
    }
});

router.delete('/:id',(req,res)=>{
    const id=req.params.id;
    try{
        const project=Project.deleteOne({_id:id});
    }catch(error){
        res.status(500).send('There was an error deleting the project');
    }
});

module.exports=router;