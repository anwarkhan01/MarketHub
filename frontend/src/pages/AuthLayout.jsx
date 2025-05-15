import React from "react";
import {Outlet} from "react-router-dom";
import ThemeToggle from "../components/ToggleTheme";
const AuthLayout = () => {
  return (
    <div className="auth-layout text-white bg-[#02010a]">
      <div className="fixed top-4 md:right-54 right-16">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
