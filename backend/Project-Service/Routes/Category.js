const express=require('express');
const router=express.Router();
const Category=require('../Models/Category');

router.get('/',async(req,res)=>{
    const categories=await Category.find();
    try{
        res.json(categories);
    }catch(error){
        console.log(error)
        res.status(500).json({message:'There was an error fetching the categories',error:error});
    }
});

router.post('/add',(req,res)=>{
    const newCategory=new Category(req.body);
    try{
        newCategory.save();
        res.json(newCategory);
    }catch(error){
        res.status(505).json({message:'There was an error saving the new category',error:error});
    }
});

module.exports=router;