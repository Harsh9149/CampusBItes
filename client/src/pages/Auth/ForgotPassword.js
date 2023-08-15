import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  // form function...
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // check for hiding this path...
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/auth/forgot-password`,
        {
          email,
          newPassword,
          answer,
        }
      );
      // console.log(res);
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong...");
    }
  };

  return (
    <Layout title="Reset Password">
      <div className="form-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="inputemail"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="inputanswer"
              placeholder="Enter Your Security Answer"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              id="inputpassword"
              placeholder="Enter Your New Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
