const jwt=require("jsonwebtoken")
const User=require('../models/user')


//  const adminAuth=(req,res,next)=>{
//     const token="xyz";
//     const isAuthorized=token ==="xyz";
//     if(!isAuthorized){
//         res.status(401).send("Unauthorized Access")
//     }else{
//         next();
//     }

// }
const UserAuth=async(req,res,next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("Token is Missing")   
    }
    const decodeObj=await jwt.verify(token,"DevTinderScretKey@123")
    const {_id}=decodeObj;
    const user=await User.findById(_id)
    if(!user){
        throw new Error("User Is Not Found")
    }
    req.user=user
    if (typeof next !== 'function') {
        console.error('UserAuth: next is not a function', next);
        return res.status(500).send('Internal middleware error: next is not a function')
    }
    next()
}catch(err){
    console.error('UserAuth error:', err)
    res.status(404).send("Error:"+err.message)
}


}
module.exports={UserAuth}
