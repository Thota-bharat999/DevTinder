require("dotenv").config();
const express=require('express');
const app=express();
const ConnectDB=require('./config/database');
const cookieParser=require("cookie-parser");
const authRouter=require('./routes/auth');
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const User = require('./models/user');
const userRouter = require('./routes/user');
const cors=require("cors");
const paymentRouter = require("./routes/payment");
const http=require("http");
const initilizeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
require("./utils/cornJobs")

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)
app.use("/",paymentRouter)
app.use("/",chatRouter)

const server=http.createServer(app)
initilizeSocket(server)
// const {adminAuth,UserAuth}=require("./middleWare/auth")

// Handle Middle Ware 
// app.use("/admin",adminAuth)
// app.use("/user",UserAuth)

// app.get("/user",(req,res,next)=>{
//     res.send("User Home Page")
// })
// app.post("user/login",(req,res)=>{
//     res.send("User Login page ")
// })
// app.get("/admin/getAlldata",(req,res)=>{
//     res.send("All Data from Admin")
// })
// app.get("/admin/deleteUser",(req,res)=>{
//     res.send("Delete User from Admin")
// }),

// app.get("/getUserData",(req,res)=>{
//     throw new Error("devsdf")
//     res.send("User Data Sent")
// }),

app.use('/',(err,req,res,next)=>{
    if(err){
        console.error(err)
        res.status(500).send(err.message)
    }
}),
ConnectDB()
.then(()=>{
    console.log("DataBase Connected Successfully")
    server.listen(process.env.PORT,()=>{
    console.log("Server is successfull Ruiing on Port 3000")
})

})
.catch((err)=>{
    console.log("Database Connection Failed",err)
})
