const express=require("express");
const { UserAuth } = require("../middleWare/auth");
const paymentRouter=express.Router();
const razorpayInstance=require("../utils/razopay")
const Payment=require("../models/payment");
const User=require("../models/user")
const { membershipAmount } = require("../utils/constant");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

paymentRouter.post("/payment/create", UserAuth, async (req, res) => {
  try {
    
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
if (!membershipType) {
      return res.status(400).json({ msg: "membershipType missing" });
    }

    if (!membershipAmount[membershipType]) {
      return res.status(400).json({ msg: "Invalid membershipType" });
    }
    console.log("Amount:", membershipAmount[membershipType]);

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        memberShip: membershipType,
      },
    });
 

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,   // frontend needs this
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});
paymentRouter.post("/payment/webhook",async(req,res)=>{
    try{
        const webhookSignature=req.get("X-Razorpay-Signature");
        const isWebhookValid=validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEB_HOOK_SECRET)
        if(!isWebhookValid){
            return res.status(400).json({msg:"webhook signature  is invalid "})
        }
        if(req.body.event ==="payment.captured"){

            const paymentDetails=req.body.payload.payment.entity
            const payment=await Payment.findOne({orderId:paymentDetails.order_id})
            payment.status=paymentDetails.status
            await payment.save()
            const user=await User.findOne({_id:payment.userId})
            user.isPremium=true;
            user.membershipType=payment.notes.membershipType
            await user.save()

        }
        if(req.body.event ==="payment.failed"){
            
        }
        return res.status(200).json({msg:"webhook Recevied successfully"})

    }catch(err){
         res.status(500).json({ msg: err.message });
    }
})
paymentRouter.get("/payment/verify",async(req,res)=>{
    const user=req.user;
    if(user.isPremium){
        return res.json({isPremium:true})
    }else{
        return res.json({isPremium:false})
    }
})


module.exports=paymentRouter;