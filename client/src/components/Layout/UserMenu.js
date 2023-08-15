import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <>
      <div className="list-group text-center">
        {" "}
        {/* techinfoyt made 2 different divs here: 4:14  */}
        <a href="/dashboard/user"><h4>Dashboard</h4></a>
        <NavLink
          to="/dashboard/user/profile"
          className="list-group-item list-group-item-action"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className="list-group-item list-group-item-action"
        >
          Orders
        </NavLink>
      </div>
    </>
  );
};

export default UserMenu;
