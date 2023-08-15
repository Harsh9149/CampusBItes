import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import "./AuthStyles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // form function...
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // check for hiding this path...
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/auth/login`,
        {
          email,
          password,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        const cartItemsId = res.data.user.cart;
        // const cartItem = await fetchProducts(cartItemsId);
        // console.log(cartItem);
        localStorage.setItem("cartItemsId", JSON.stringify(cartItemsId));
        localStorage.setItem("cartSize", JSON.stringify(cartItemsId.length));
        localStorage.setItem("isCartLoaded", JSON.stringify(0));
        console.log(location);
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong...");
    }
  };

  return (
    <Layout title="Sign In">
      <div className="form-container">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="inputemail"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="inputpassword"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <br />
            <button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
