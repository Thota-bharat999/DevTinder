const mongoose=require("mongoose");
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["interested","accepted","rejected","ignored"],
            message:`{VALUE} is incorrect Status type`
        },
    },
},{timestamps:true}
)
connectionRequestSchema.pre("save",function(){
    const connectionRequest=this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
})
const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequestModel;