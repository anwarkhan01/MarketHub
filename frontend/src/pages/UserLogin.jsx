import React from "react";
import {useForm} from "react-hook-form";
import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import Toast from "../components/Toast.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
const UserLogin = () => {
  const {setIsAuthenticated, setUserData} = useContext(AuthContext);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({});
  const [showProgressBar, setShowProgressBar] = useState(false);
  const {
    handleSubmit,
    register,
    setError,
    formState: {errors, isSubmitted},
  } = useForm();

  const onSubmit = async (data) => {
    setShowProgressBar(true);
    const renderTimeOut = setTimeout(() => {
      setToastData({
        message: "Server is starting up, please wait a moment...",
        type: "information",
      });
      setShowToast(true);
    }, 3000);

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
      clearTimeout(renderTimeOut);
      if (response.ok) {
        setShowProgressBar(false);
        let data = await response.json();
        setIsAuthenticated(true);
        setUserData(data.data.user);
        navigate("/");
      } else {
        setShowProgressBar(false);
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
    <div className="min-h-screen flex items-center justify-center dark:bg-[#02010A] bg-gray-200">
      <div className="w-full max-w-md p-8 dark:bg-[#04052E] bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold dark:text-white text-[#140152] text-center mb-6">
          User Login
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
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
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 rounded-lg shadow-sm border  focus:ring-[#22007C]"
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
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
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
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] rounded-lg shadow-sm border dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 focus:ring-[#22007C]"
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
          <p className="text-sm dark:text-gray-300 text-gray-700 text-center">
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
      {showProgressBar && <ProgressBar />}
    </div>
  );
};

export default UserLogin;
