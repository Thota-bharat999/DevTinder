const express=require("express");
const {validateSignupdata}=require('../utils/validation');
const authRouter=express.Router();
const User=require('../models/user');
const bcrypt=require("bcrypt")
authRouter.post("/signup",async(req,res)=>{
    
try{
    validateSignupdata(req)
    const{firstName,lastName,emailId,password}=req.body;
    const passwordhash=await bcrypt.hash(password,10);
    console.log(passwordhash)
    const user=new User({
        firstName,lastName,emailId,password:passwordhash,
    })

    await user.save()
    res.send("User Added Successfully")
}catch(err){
    res.status(400).send(err.message)
}
})
authRouter.post('/login',async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user =await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("Invalid Login Credentials")
        }
        const isPasswordValid=await user.validatePassword(password)
        if(!isPasswordValid){
            const token=await user.getJSON()
            console.log(token)

            // add the cookie teh response backto the user
            res.cookie("token",token, {
                expires:new Date(Date.now()+8*360000)
            })
            res.send("Login Successfully")
        }else{
            throw new Error("invalid Credentials")
        }



    }catch(err){
    res.status(400).send(err.message)
}
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("Logout Successfully")
})
module.exports=authRouter