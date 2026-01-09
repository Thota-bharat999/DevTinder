const express=require('express');
const app=express();
const ConnectDB=require('./config/database');
const cookieParser=require("cookie-parser");
const authRouter=require('./routes/auth');
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const User = require('./models/user');
const userRouter = require('./routes/user');
const cors=require("cors")
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





// Get:/user by mail
app.get("/user", async(req,res)=>{
    const userEmail=req.body.emailId
    try{
        const foundUser = await User.findOne({emailId:userEmail})
        if(!foundUser){
            return res.status(404).send("User Not Found")
        }else{
res.send(foundUser)
        }
        
    }catch(err){
        console.error(err)
        res.status(400).send(err.message)
    }
})

app.get("/feed",(async(req,res)=>{
    try{
    const users=await User.find({})
    res.send(users)
    }catch(err){
        console.error(err)
        res.status(400).send(err.message)
    }
}))
app.delete("/user",async(req,res)=> {
    const userId=req.body.id;
    try{
        const user=await User.findByIdAndDelete(userId)
        res.send(user)
    }catch(err){
        console.error(err)
        res.status(400).send(err.message)
    }
})

app.patch("/user", async (req, res) => {
    const data = req.body;
    const userId = req.body.userId;
    
    try {
        const Allowe_updates=[
        "uuserId","photoUrl","about","gender","Skills","age","skills"
    ]
    const is_allowed=Object.keys(data).every((key)=>{
        return Allowe_updates.includes(key)
    })
    if(!is_allowed){
        return res.status(400).send("Invalid Updates Request")
    }
    if(data?.skills.length>10){
        throw new Error("Skills Cannot be more than 10")
    }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            data,
            { returnDocument: "after", runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).send("User Not Found");
        }
        res.send(updatedUser);
    } catch (err) {
        console.error(err)
        res.status(400).send(err.message);
    }
})


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
    app.listen(3000,()=>{
    console.log("Server is successfull Ruiing on Port 3000")
})

})
.catch((err)=>{
    console.log("Database Connection Failed",err)
})
