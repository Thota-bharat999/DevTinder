const express=require("express")
const profileRouter=express.Router();
const User=require('../models/user');
const {UserAuth}=require("../middleWare/auth")

profileRouter.get("/profile/view", UserAuth,async(req,res)=>{
    try{
    const user=req.user;
    res.send(user)
}catch(err){
        console.error('Token verification failed', err)
        return res.status(401).send('Invalid or expired token')
    }
})
profileRouter.get("/profile/edit", UserAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        res.send({ message: "Edit profile endpoint — use PATCH to update", user });
    } catch (err) {
        console.error(err)
        return res.status(401).send('Invalid or expired token')
    }
})
profileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
    try{
        if(!validateProfileData(req)){
            throw new Error("Invalid Edit Fields")
        }
        const loggedInUser=req.user;
        console.log(loggedInUser)

    }catch(err){
        res.status(400).send("Error:"+err.message)
    }
})


module.exports=profileRouter