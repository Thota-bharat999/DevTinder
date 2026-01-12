const jwt=require("jsonwebtoken")
const User=require('../models/user')

const UserAuth=async(req,res,next)=>{
  try{
    const token = req.cookies && req.cookies.token;

    if(!token){
      throw new Error("Token is Missing")   
    }

    const decodeObj=await jwt.verify(token,process.env.JWT_SECRET)
    const {_id}=decodeObj;

    const user=await User.findById(_id)
    if(!user){
      throw new Error("User Is Not Found")
    }

    req.user=user
    next()

  }catch(err){
    console.error('UserAuth error:', err)
    res.status(401).send("Error:" + err.message) // ✅ FIXED
  }
}

module.exports={UserAuth}
