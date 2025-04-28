import React from "react";
import {useForm} from "react-hook-form";
import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import Toast from "../components/Toast.jsx";
const UserLogin = () => {
  const {setIsAuthenticated, setUserData} = useContext(AuthContext);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({});
  const {
    handleSubmit,
    register,
    setError,
    formState: {errors, isSubmitted},
  } = useForm();

  const onSubmit = async (data) => {
    console.log("login started");
    try {
      setIsAuthenticated(false);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/user-login`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      if (response.ok) {
        let data = await response.json();
        setIsAuthenticated(true);
        if (data.data.user) {
          setUserData(data.data.user);
          navigate("/");
        } else {
          setUserData(data.data.sp);
          navigate("/");
        }
      } else {
        setIsAuthenticated(false);
        let data = await response.json();
        setToastData({message: data.message, duration: 3000, type: "failure"});
        setShowToast(true);

        console.log(data);
      }
    } catch (error) {
      console.log("some error occured while logging", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02010A]">
      <div className="w-full max-w-md p-8 bg-[#04052E] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          User Login
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              {...register("username", {
                required: {value: true, message: "username is required"},
              })}
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.username && (
              <span className="text-xs text-red-700">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              {...register("password", {
                required: {value: true, message: "password is required"},
              })}
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.password && (
              <span className="text-xs text-red-700">
                {errors.password.message}
              </span>
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
              href="user-register"
              className="text-[#22007C] font-medium hover:underline"
            >
              Register here
            </a>
          </p>
        </form>
      </div>
      {showToast && (
        <Toast
          message={toastData.message}
          duration={toastData.duration}
          type={toastData.type}
          onclose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default UserLogin;
