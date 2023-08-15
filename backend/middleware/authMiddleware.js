import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token base...
const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // console.log(decode);
    // req.user = await userModel.findById(decode._id);
    req.user = decode;

    next();
  } catch (error) {
    // console.log(`Error in signIn ${error}`);
    res.status(500).json({
      success: false,
      message: "Error in signIn",
      error,
    });
  }
};

//admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    // console.log(user);
    if (!user.role) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    // console.log(`Error in checking for admin: ${error}`);
    res.status(500).send({
      success: false,
      message: "Error in checking for admin...",
      error,
    });
  }
};

export { requireSignIn, isAdmin };
