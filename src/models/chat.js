const mongoose=require("mongoose");


const messageSchmea=new mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        text:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)




const chatSchema=new mongoose.Schema({
    participantes:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
    ],
    messages:[messageSchmea],


});
const Chat=mongoose.model("Chat",chatSchema);
module.exports={Chat}