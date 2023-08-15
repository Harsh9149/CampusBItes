import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import "../styles/Homepage.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [values, setValues] = useSearch();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const addCartItem = async (p) => {
    try {
      if (auth?.token) {
        const index = cart.findIndex((c) => {
          return JSON.stringify(c.product._id) === JSON.stringify(p._id);
        });
        // console.log(result);
        if (index >= 0) {
          const newCart = cart;
          newCart[index].count += 1;
          console.log(newCart);
          setCart([...newCart]);
          localStorage.setItem("cart", JSON.stringify([...newCart]));
        } else {
          setCart([...cart, { product: p, count: 1 }]);
          localStorage.setItem(
            "cart",
            JSON.stringify([...cart, { product: p, count: 1 }])
          );
          let cartSize = JSON.parse(localStorage.getItem("cartSize"));
          localStorage.setItem("cartSize", JSON.stringify(cartSize + 1));
        }
        // setCart([...cart, p]);
        await axios.put(`${process.env.REACT_APP_API}/api/auth/addtocart`, {
          email: auth.user.email,
          product: p,
        });
        toast.success("Item Added to cart");
      } else {
        toast.success("Login to add to cart");
        navigate("/login");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <Layout title={"Search"}>
      <div className="search home-page">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap">
            {values?.results.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        addCartItem(p);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
