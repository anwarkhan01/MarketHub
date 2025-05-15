import React, {useState} from "react";
import {Link} from "react-router-dom";
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#02010A] bg-gray-200">
      <div className="w-full max-w-md p-8 dark:bg-[#04052E] bg-[#E9EDFB] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold dark:text-white text-[#140152] text-center mb-6">
          Login to your account
        </h1>
        {/* User Login */}
        <div className="mb-6 p-4 dark:bg-[#140152] bg-[#D6DBF5] rounded-lg text-center shadow-md">
          <Link to="user-login">
            <button className="w-full py-3 bg-[#22007C] text-white font-semibold rounded-lg hover:bg-[#1a005f]">
              User Login
            </button>
          </Link>

          <p className="mt-4 text-sm dark:text-gray-300 text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="user-register"
              className="dark:text-[#22007C] text-[#22007C] font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Service Provider Login */}
        <div className="p-4 dark:bg-[#140152] bg-[#D6DBF5] rounded-lg text-center shadow-md">
          <Link to="sp-login">
            <button className="w-full py-3 bg-[#22007C] text-white font-semibold rounded-lg hover:bg-[#1a005f]">
              Service Provider Login
            </button>
          </Link>
          <p className="mt-4 text-sm dark:text-gray-300 text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="sp-register"
              className="text-[#22007C] font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
        <div className="temp mt-4">
          <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-800">
            Use these demo accounts to log in:
          </h3>

          <h2 className="text-[#22007C] font-bold mt-4">For User</h2>
          <p className="dark:text-white text-gray-600">
            <span className="font-medium">Username:</span> user4
          </p>
          <p className="dark:text-white text-gray-600">
            <span className="font-medium">Password:</span> 1234
          </p>

          <h2 className="text-[#22007C] font-bold mt-4">
            For Service Provider
          </h2>
          <p className="dark:text-white text-gray-600">
            <span className="font-medium">Username:</span> asp3
          </p>
          <p className="dark:text-white text-gray-600">
            <span className="font-medium">Password:</span> 1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
