const mongoose=require("mongoose");
const paymentSchmea=new mongoose.Schema({
   
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
   
    orderId:{
        type:String,
        
    },
    status:{
        type:String,
        required:true

    },
    amount:{
        type:String,
        required:true,
    },
    currency:{
        type:String,
        required:true,
    },
    receipt:{
        type:String,
        required:true,
    },
    notes:{
        firstName:{
            type:String,
        },
        lastName:{
            type:String,

        },
        memberShipType:{
            type:String
        }
    }

},{timestamps:true})
module.exports=new mongoose.model("Payment",paymentSchmea)