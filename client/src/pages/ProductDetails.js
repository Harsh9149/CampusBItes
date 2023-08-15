import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  //initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/get-product/${params.slug}`
      );
      if (data?.product) {
        setProduct(data?.product);
        getSimilarProduct(data?.product._id, data?.product.category._id);
      } else {
        navigate("/product*");
      }
    } catch (error) {
      // console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
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

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            class="btn btn-secondary ms-1"
            onClick={() => {addCartItem(product)}}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
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
      </div>
    </Layout>
  );
};

export default ProductDetails;
