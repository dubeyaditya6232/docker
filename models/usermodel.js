const mongoose=require('mongoose');
const schema=mongoose.Schema;

const userSchema=new schema({
    username:{
        type:String,
        required:[true,"User must have a username"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"User must have password"],
    }
});

module.exports=mongoose.model('user',userSchema);