const mongoose=require('mongoose');

const complainSchema=new mongoose.Schema({
    Name:String,
    collegeId:String,
    Title:String,
    Details:String,
    Priority:String,
    date:String,
    department:String
})


const complain= new mongoose.model("complain",complainSchema);

module.exports=complain;

