import express, { json } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";

// rest object...
const app = express();
// environment variable setup
dotenv.config();
//database connected...
connectDB();

//middleware...
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// routes...
app.use("/api/auth", authRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to our ecommerce app</h1>");
});

// Port
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
