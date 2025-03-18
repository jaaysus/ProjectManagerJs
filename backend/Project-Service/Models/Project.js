const mongoose=require('mongoose');
const ProjectSchema=new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    startDate:{type:Date},
    endDate:{type:Date},
    category:[{type:mongoose.Schema.Types.ObjectId,ref:'Category'}],
    status:{type:String}
});
module.exports=mongoose.model('Project',ProjectSchema);