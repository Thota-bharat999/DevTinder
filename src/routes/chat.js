const express=require("express");
const { Chat } = require("../models/chat");
const { UserAuth } = require("../middleWare/auth");
const chatRouter=express.Router()
chatRouter.get('/chat/:targetUserId',UserAuth,async(req,res)=>{
    const {targetUserId}=req.params;
    const userId=req.user._id;
    try{
        let chat=await Chat.findOne({
            participantes:{$all:[userId,targetUserId]}
        }).populate({
  path: "messages.senderId",
  select: "firstName lastName"
})

        if(!chat){
            chat=new Chat({
                participantes:[userId,targetUserId],messages:[]
            });
            await chat.save()
        }
        res.json(chat)
    }catch(err){
        console.error(err)
    }
})

module.exports=chatRouter