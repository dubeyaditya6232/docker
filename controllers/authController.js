const User=require('../models/usermodel');
const bcrypt=require('bcryptjs');

exports.getAllUsers=async (req,res,next)=>{
    try{
        const user =await User.find({});

        if(!user){
            return res.status(404).json({
                status:'success',
                message:"No users registered",
            });
        }
        res.status(200).json({
            status:"success",
            data:{
                users:user, 
            }
        });

    }catch(e){
        res.status(400).json({
            status:'fail',
        });
    }
}

exports.signup= async (req,res,next)=>{
    const{username,password}=req.body;
    try{
        const hashPassword= await bcrypt.hash(password,12);
        const newUSer= await User.create({
            username,
            password:hashPassword
        });
        req.session.user=newUSer;
        res.status(201).json({
            status:"success",
            data:{
                user:newUSer,
            }
        });
    }catch(e){
    res.status(400).json({
        status:'registration failed',
    });
    }
};
exports.login= async (req,res,next)=>{
    const {username,password}=req.body;
    try{
        const user= await User.findOne({username});

        if(!user){
            return res.status(404).json({
                status:'failed',
                message:"user not found",
            });
        }
        const isCorrect= await bcrypt.compare(password,user.password);
        req.session.user=user;
        if(isCorrect){
            res.status(200).json({
                status:'success'
            });
        }else{
            res.status(400).json({
                status:'failed',
                message:"incorrect username or password",
            });
        }
    }catch(e){
    res.status(400).json({
        status:'login failed',
    });
    }
}