const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    Name:String,
    category:String,
    phoneno:String,
    email:String,
    password:String,
    collegeId:String
});

const user=new mongoose.model("newestuser",userSchema);

module.exports= user;
