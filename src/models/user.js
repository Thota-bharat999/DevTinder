const mongoose=require("mongoose");
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email Is Invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isStrongPassword(value, {
                minLength: 6,
                minLowercase: 0,
                minUppercase: 0,
                minNumbers: 0,
                minSymbols: 0
            })){
                throw new Error("password is not Strong Engough",+ value)
            }
        }
    },
    age:{
        type:Number
    },
    Gender:{
        type:String,
        validate(value){
            if(["male","female","other"].includes(value)){
                throw new Error("Gender Data is must be Valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://stock.adobe.com/in/images/simple-gray-avatar-icons-representing-male-and-female-profiles-vector-minimalist-design-with-a-professional-touch/844844652",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is Invalid")
            }
        }
    },
    about:{
        type:String,
        default:"This is the default about section "
    },
    skills:{
        type:[String]
    }
},{
    timestamps:true,
})
userSchema.methods.getJSON=async function(){
    const user=this
    const token= await jwt.sign({_id:user._id},"DevTinderScretKey@123", {expiresIn:"1d"})
    return token
    
}
userSchema.methods.validatePassword=async function(passwordInputByUSer){
    const user=this
    const hashedPassword=this.password
    const isPasswordMatch=await bcrypt.compare(passwordInputByUSer,hashedPassword)
    return isPasswordMatch
}

 const user= mongoose.model("User",userSchema);
module.exports=user