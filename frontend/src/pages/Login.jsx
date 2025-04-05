import React from "react";
import {Link} from "react-router-dom";
import Header from "../components/Header";
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02010A]">
      <div className="w-full max-w-md p-8 bg-[#04052E] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Login to your account
        </h1>
        {/* User Login */}
        <div className="mb-6 p-4 bg-[#140152] rounded-lg text-center shadow-md">
          <Link to="user-login">
            <button className="w-full py-3 bg-[#22007C] text-white font-semibold rounded-lg hover:bg-[#1a005f]">
              User Login
            </button>
          </Link>

          <p className="mt-4 text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="user-register"
              className="text-[#22007C] font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Service Provider Login */}
        <div className="p-4 bg-[#140152] rounded-lg text-center shadow-md">
          <Link to="sp-login">
            <button className="w-full py-3 bg-[#22007C] text-white font-semibold rounded-lg hover:bg-[#1a005f]">
              Service Provider Login
            </button>
          </Link>
          <p className="mt-4 text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="sp-register"
              className="text-[#22007C] font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
