const jwt=require("jsonwebtoken")
const User=require('../models/user')

const UserAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decodeObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("UserAuth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};


module.exports={UserAuth}
