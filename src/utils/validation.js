const validator=require("validator");
const validateSignupdata=(req)=>{
    const{firstName,lastName,emailId,password}=req.body
    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    } else if(!validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0
    })){
        throw new Error("Please Enter The Strong Password")
    }
}
const validateProfileData=(req)=>{
    const allowededitFields=["firstName","lastName","photoUrl","about","gender","skills","age"]
   const isAllowed= Object.keys(req.body).every(field=>allowededitFields.includes(field)
)
return isAllowed
}
module.exports={validateSignupdata}