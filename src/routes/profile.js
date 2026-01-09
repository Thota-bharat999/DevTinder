const express=require("express")
const profileRouter=express.Router();
const User=require('../models/user');
const {UserAuth}=require("../middleWare/auth")
const {validateEditProfileData}  = require("../utils/validation");


profileRouter.get("/profile/view", UserAuth,async(req,res)=>{
    try{
    const user=req.user;
    res.send(user)
}catch(err){
        console.error('Token verification failed', err)
        return res.status(401).send('Invalid or expired token')
    }
})
profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
    try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})



module.exports=profileRouter