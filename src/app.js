const express=require('express');
const app=express();

app.post("/user",
    (req,res,next)=>{
    console.log("hello return Data")
   next();
   res.send("This is The Route Handler 1")
//    next()
},(req,res,next)=>{
    console.log("Handle in The Second Router")
    // res.send("This is The Route Handler 3");
    next();
},(req,res,next)=>{
    console.log("Handle in The Second Router")
    // res.send("This is The Route Handler 4");
    next()
},(req,res,next)=>{
    console.log("Handle in The Second Router")
    res.send("This is The Route Handler 2");
}),


app.listen(3000,()=>{
    console.log("Server is successfull Ruiing on Port 3000")
})

