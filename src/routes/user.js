const express=require("express");
const { UserAuth } = require("../middleWare/auth");
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")
const userRouter=express.Router();

userRouter.get("/user/requests",UserAuth,async(req,res)=>{
    try{
        const loggedInUserId=req.user
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUserId,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl"])
        res.json({
            message:"Data fetched Successfully",
            data:connectionRequests
        })

    }catch(err){
        return res.status(400).send("ERROR:"+err.message)
    }
})

userRouter.get("/user/connections",UserAuth,async(req,res)=>{
    try{
        const loggedInUserId=req.user
const connectionRequests=await ConnectionRequest.find({
    $or:[
        {toUserId:loggedInUserId,status:"accepted"},
        {fromUserId:loggedInUserId,status:"accepted"}
    ]
}).populate("fromUserId",["firstName","lastName","age","photoUrl"]).populate("toUserId",["firstName","lastName","age","photoUrl"])
const data=connectionRequests.map((row)=>{
    if(row.fromUserId._id.toString()===loggedInUserId._id.toString()){
        return row.toUserId
    }
    return row.fromUserId
})
console.log(connectionRequests)

res.json({
    data
})
    }catch(err){
        return res.status(400).send({message:err.message})
    }
})
userRouter.get("/feed",UserAuth,async(req,res)=>{
    try{
        const loggedInUserId=req.user;
        const page=parseInt(req.query.page) ||1
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit
        const skip=(page-1)*limit
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUserId._id},
                {toUserId:loggedInUserId._id}
            ]
        }).select("fromUserId toUserId");
const hideFromUserFeed=new Set()
connectionRequests.forEach(req=>{
    hideFromUserFeed.add(req.fromUserId.toString())
    hideFromUserFeed.add(req.toUserId.toString())
})


const users=await User.find({
    $and:[
        {_id:{$nin:Array.from(hideFromUserFeed)}},
        {_id:{$ne:loggedInUserId._id}}
    ]
}).select("firstName lastName age photoUrl about").skip(skip).limit(limit)
        res.send(users)

    }catch(err){
        return res.status(400).send({message:err.message})
    }
})
module.exports=userRouter