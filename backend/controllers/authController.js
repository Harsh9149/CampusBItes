import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//register
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    const cart = [];
    // validations...
    if (!name) {
      return res.send({ message: "Name is required." });
    }
    if (!email) {
      return res.send({ message: "Email is required." });
    }
    if (!password) {
      return res.send({ message: "Password is required." });
    }
    if (!phone) {
      return res.send({ message: "Phone no. is required." });
    }
    if (!address) {
      return res.send({ message: "Address is required." });
    }
    if (!answer) {
      return res.send({ message: "Answer is required." });
    }
    // check user...
    const existingUser = await userModel.findOne({ email });
    // existing user
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Already Registered Please login",
      });
    }
    // register user
    const hashedPassword = await hashPassword(password);
    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      cart,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    // console.log(`Error in register controller: ${error}`);
    res.status(500).send({
      success: false,
      message: "Error in registration form",
      error,
    });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation...
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Please enter email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        // _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        cart: user.cart,
      },
      token,
    });
  } catch (error) {
    // console.log(`Error in login: ${error}`);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// forgot password
const forogotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(404).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(404).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(404).send({ message: "New Password is required" });
    }
    // check...
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Passwrod reset successfully...",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong...",
      error,
    });
  }
};

// test...
const testController = async (req, res) => {
  // console.log("protected route");
  res.send("Protected route");
};

//update prfile
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword must be 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating profile",
      error,
    });
  }
};

// add to cart
const addToCartController = async (req, res) => {
  try {
    const { email, product } = req.body;
    const response = await userModel.findOne({ email });
    const cart = response.cart;
    const index = cart.findIndex((c) => {
      console.log(JSON.stringify(c.product._id) );
      return JSON.stringify(c.product._id) === JSON.stringify(product._id);
    });
    // console.log(index);
    if(index>=0){
      cart[index].count++;
    }
    else{
      cart.push({product: product, count : 1});
    }
    // cart.push(product);
    await userModel.findByIdAndUpdate(response._id, { cart: cart });
    res.status(200).json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while adding item to cart",
      error,
    });
  }
};

// remove from cart
const removeFromCartController = async (req, res) => {
  try {
    const { email, productId } = req.body;
    const response = await userModel.findOne({ email });
    const cart = response.cart;
    // remove item from cart...
    const updatedCart = [];
    cart.forEach((c) => {
      if (JSON.stringify(c.product._id) == JSON.stringify(productId)) {
        if(c.count>1){
          c.count--;
          updatedCart.push(c);
        }
      } else {
        updatedCart.push(c);
      }
    });
    const updateRes = await userModel.findByIdAndUpdate(response._id, {
      cart: updatedCart,
    });
    // console.log(updateRes.cart);
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while removing item from cart",
      error,
    });
  }
};

// empty the cart
const deleteCartController = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await userModel.findOne({ email });
    const updatedCart = [];
    await userModel.findByIdAndUpdate(response._id, { cart: updatedCart });
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while removing item from cart",
      error,
    });
  }
};

//orders getOne
const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders getAll
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

export {
  registerController,
  loginController,
  testController,
  forogotPasswordController,
  updateProfileController,
  addToCartController,
  removeFromCartController,
  deleteCartController,
  getAllOrdersController,
  getOrdersController,
  orderStatusController,
};
