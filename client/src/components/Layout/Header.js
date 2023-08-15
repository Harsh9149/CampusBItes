import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import "./Header.css";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const categories = useCategory();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    // localStorage.removeItem("auth");
    localStorage.clear();
    setCart([]);
    toast.success("Logout Successfully");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top navbar-default">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand">
              <p id="brandname">Campus Bites</p>
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />
              <li className="nav-item">
                <Link to="/" className="nav-link ">
                  HOME
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to={"/categories"}
                  data-bs-toggle="dropdown"
                >
                  CATEGORIES
                </Link>
                <ul className="dropdown-menu">
                  {categories?.map((c) => (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      SIGN UP
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      SIGN IN
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      style={{ border: "none" }}
                    >
                      {auth?.user?.name}
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="dropdown-item"
                        >
                          DASHBOARD
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          LOG OUT
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link to="/cart" className="nav-link">
                      <Badge
                        count={localStorage.getItem("cartSize")}
                        showZero
                        offset={[10, -5]}
                      >
                        🛒
                      </Badge>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
