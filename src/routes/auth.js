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

    const savedUser=await user.save()
    const token = await savedUser.getJSON();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000)
    });
    res.json({message:"User Added Successfully", data:savedUser})
}catch(err){
    res.status(400).send(err.message)
}
})
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, email, password } = req.body;
    const userEmail = (emailId || email)?.trim().toLowerCase();

    if (!userEmail || !password) {
      return res.status(400).send("email and password are required");
    }

    const user = await User.findOne({
      emailId: { $regex: `^${userEmail}$`, $options: 'i' }
    });

    console.log('Login attempt for:', userEmail);

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    const token = await user.getJSON(); // this should return JWT

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // REQUIRED on AWS
      sameSite: "none",    // REQUIRED for cross-domain
      maxAge: 8 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error during login");
  }
});


authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("Logout Successfully")
})
module.exports=authRouter