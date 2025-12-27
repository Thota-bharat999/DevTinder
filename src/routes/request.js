const express=require("express");
const requestRouter=express.Router();
const User=require('../models/user');
const {UserAuth}=require("../middleWare/auth")
const ConnectionRequest=require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId", UserAuth,async (req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const allowedStattus=["interested","ignored"];
        if(!allowedStattus.includes(status)){
            return res.status(400).json({
                message:"Invalid Status type:"+status
            })
        }
        const touser=await User.findById(toUserId)
        if(!touser){
            return res.status(404).json({
                message:"User is not found"
            })
        }
        const existingRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingRequest){
            return res.status(400).json({
                message:"Connection Request already exists between the users"
            })
        }
        const connectionRequest=new ConnectionRequest({
            fromUserId,toUserId,status
        })
        const data=await connectionRequest.save()
        res.json({
            message:req.user.firstName+"is "+status+" to "+touser.firstName,
            data,
        })
    }catch(err){
        return res.status(400).send("ERROR:"+err.message)
    }
    
    
})

requestRouter.post("/request/review/:status/:requestId", UserAuth,async(req,res)=>{
    try{
        const logedinUser=req.user;
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status is not allowed"
            })
        }
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:logedinUser._id,
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(404).json({
                message:"Connection Request is not found"
            })
        }
        connectionRequest.status=status
        const data=await connectionRequest.save()
        res.json({
            message:"Connection Request "+status,data
        })
    }catch(err){
        return res.status(400).send("ERROR:"+err.message)
    }
})
module.exports=requestRouter