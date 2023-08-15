import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getPrductsByCategory();
  }, [params?.slug]);
  const getPrductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      // console.log(error);
    }
  };

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
    } catch (error) {}
  };

  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="row">
          <div className="offset-1">
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
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
                        onClick={() => {addCartItem(p)}}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
