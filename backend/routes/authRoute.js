import express from "express";
import {
  registerController,
  loginController,
  testController,
  forogotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  addToCartController,
  removeFromCartController,
  deleteCartController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
//router object...
const router = express.Router();

// routing...
// REGISTER || METHOD POST
router.post("/register", registerController);
//login
router.post("/login", loginController);
// Forgot password...
router.post("/forgot-password", forogotPasswordController);
//test
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route...
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// protected admin route...
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//add item to cart
router.put("/addtocart", requireSignIn, addToCartController);

//remove item from cart
router.put("/editcart", requireSignIn, removeFromCartController);

// empty the whole cart
router.put("/deletecart", requireSignIn, deleteCartController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
