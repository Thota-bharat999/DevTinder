const mongoose=require("mongoose");
const ConnectDB=async()=>{
    await mongoose.connect(
    "mongodb+srv://DevTinder:DevTinder123@cluster0.ciqbnzp.mongodb.net/DevTinderDB"
    )

}
module.exports=ConnectDB