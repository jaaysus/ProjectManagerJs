const express=require('express');
const router=express.Router();
const Project=require('../Models/Project');

// -->CRUD<--

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
        res.status(505).json({message:'There was an error saving the new project'});
    }
});

router.put('/:id',async(req,res)=>{
    const id=req.params.id;
    const data=req.body;
    try{
        const ModifiedProject=await Project.updateOne({_id:id},data);
        res.json(ModifiedProject);
    }catch(error){
        console.log(error)
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

// -->Filtrage<--

router.post('/filter',async(req,res)=>{
    const name=req.body.name;
    const startDate=req.body.startDate;
    const endDate=req.body.endDate;
    const status=req.body.status;
    let projects=[];
    try{
        if(name){
            projects=await Project.find({name:name});
        }
        if(startDate){
            projects=await Project.find({startDate:startDate});
        }
        if(endDate){
            projects=await Project.find({endDate:endDate});
        }
        if(status){
            projects=await Project.find({status:status});
        }
        res.json(projects);
    }catch(error){
        console.error(error);
        res.status(500).send('There was an error during data filtering')
    }
});

module.exports=router;