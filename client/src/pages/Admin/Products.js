import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../../styles/Homepage.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      // console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <Layout title={"Admin Dashboard - Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row dashboard home-page">
          <div className="col-md-3 ">
            <AdminMenu />
          </div>
          <div className="col-md-9 ">
            <h1 className="text-center">All Products List</h1>
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div className="card m-2" key={p._id}>
                  <Link
                    key={p._id}
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="product-link"
                  >
                    <img
                      src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </Link>
                  <div className="card-body product-card">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
