import React from "react";
import {Outlet} from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-layout text-white bg-[#02010a]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
