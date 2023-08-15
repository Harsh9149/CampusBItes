import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { useAuth } from "../context/auth";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      // console.log(error);
      setLoading(false);
    }
  };

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      // console.log(error);
    }
  };

  // get cart
  async function fetchProducts(cartItems) {
    const cart = await Promise.all(
      cartItems.map(async (p) => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/product/get-productbyid/${p.product}`
          );
          const cartItem = { product: res.data.product, count: p.count };
          return cartItem;
        } catch (error) {
          console.error(`Error fetching product with ID ${p}:`, error);
          return null; // or some default value indicating an error
        }
      })
    );
    // 'cart' now contains an array of product data obtained from the API for each cart item
    return cart;
  }
  const getCart = async () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItemsId"));
    // console.log(cartItems);
    const cart_ = await fetchProducts(cartItems);
    // console.log(cart_);
    setCart([...cart_, ...cart]);
    localStorage.setItem("cart", JSON.stringify([...cart_, ...cart]));
  };
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("isCartLoaded")) === 0) {
      getCart();
      localStorage.setItem("isCartLoaded", JSON.stringify(1));
    }
  }, [auth?.token]);

  // add to cart
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
    <Layout title={"Campus Bites"}>
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                className="checkbox"
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
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
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
