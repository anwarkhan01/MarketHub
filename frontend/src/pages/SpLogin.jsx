import React from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../context/AuthProvider.jsx";

const SpLogin = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm();

  const {setIsAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/service-provider/login-sp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true); // Update the auth state
        navigate("/");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.log("error occured while login", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02010A]">
      <div className="w-full max-w-md p-8 bg-[#04052E] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Service Provider Login
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="sp-username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="sp-username"
              name="username"
              {...register("username", {
                required: {value: true, message: "username is requiredd"},
              })}
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.username && (
              <span className="text-red-600">{errors.username.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="sp-password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="sp-password"
              name="password"
              {...register("password", {
                required: {value: true, message: "password is required"},
              })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.password && (
              <span className="text-red-600">{errors.password.message}</span>
            )}
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-[#22007C] text-white font-semibold rounded-lg hover:bg-[#1a005f] transition-colors"
            >
              Login
            </button>
          </div>

          {/* Register Link */}
          <p className="text-sm text-gray-300 text-center">
            Don’t have an account?{" "}
            <a
              href="sp-register"
              className="text-[#22007C] font-medium hover:underline"
            >
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SpLogin;
