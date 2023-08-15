import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.product.price*item.count;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      // console.log(error);
    }
  };
  //detele item
  const removeCartItem = async (pid) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/auth/editcart`,
        {
          email: auth.user.email,
          productId: pid,
        }
      );
      if (res.data.success) {
        const myCart = cart.reduce(
          (acc, p) => {
            if (JSON.stringify(p.product._id) === JSON.stringify(pid)) {
              if (p.count > 1) {
                p.count-=1;
                acc.cart.push(p);
              }
            } else {
              acc.cart.push(p);
            }
            return acc;
          },
          { cart: [] }
        );
        const myCart_ = myCart.cart;
        // console.log(myCart_);
        setCart(myCart_);
        localStorage.setItem("cart", JSON.stringify([...myCart_]));
        // changing size of cart
        localStorage.setItem("cartSize", JSON.stringify(myCart_?.length));
        window.location.reload(true);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  //add cart item...
  const addCartItem = async (p) => {
    try {
      if (auth?.token) {
        const index = cart.findIndex((c) => {
          return JSON.stringify(c.product._id) === JSON.stringify(p._id);
        });
        // console.log(result);
        if(index>=0){
          const newCart = cart;
          newCart[index].count+=1;
          console.log(newCart);
          setCart([...newCart]);
          localStorage.setItem(
            "cart",
            JSON.stringify([...newCart])
          );
        }
        else{
          setCart([...cart, {product: p, count : 1}]);
          localStorage.setItem(
            "cart",
            JSON.stringify([...cart, {product: p, count : 1}])
          );
          let cartSize = JSON.parse(
            localStorage.getItem("cartSize")
          );
          localStorage.setItem(
            "cartSize",
            JSON.stringify(cartSize + 1)
          );
        }
        // setCart([...cart, p]);
        await axios.put(
          `${process.env.REACT_APP_API}/api/auth/addtocart`,
          {
            email: auth.user.email,
            product: p,
          }
        );
        toast.success("Item Added to cart");
      } else {
        toast.success("Login to add to cart");
        navigate("/login");
      }
    } catch (error) {
      // console.log(error);
    }
  }

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      await axios.put(`${process.env.REACT_APP_API}/api/auth/deletecart`, {
        email: auth.user.email,
      });
      localStorage.setItem("cartSize", JSON.stringify(0));
      // console.log(auth);
      // if(auth?.user?.role===0)  // to check as orders can't be placed from admin accounts...
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      // console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout title={"Cart"}>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {/* {cart?.length
                  ? `You have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"} */}
                {auth?.token
                  ? `You have ${cart.length} items in your cart.`
                  : "please login to checkout !"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {console.log(cart)}
              {cart?.map((p) => (
                <div className="row card flex-row" key={p.product._id}>
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/product/product-photo/${p.product._id}`}
                      className="card-img-top"
                      alt={p.product.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.product.name}</p>
                    <p>{p.product.description.substring(0, 30)}</p>
                    <p>Price : {p.product.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p.product._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn btn-primary"
                    >
                      {p.count}
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => addCartItem(p.product)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
