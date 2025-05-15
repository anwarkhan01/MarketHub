import React from "react";
import {useState, useRef, useEffect} from "react";
import {useForm} from "react-hook-form";
import MapComponent from "../components/MapComponent.jsx";
import getReadableAddress from "../utils/getReadableAddress.js";
import {useContext} from "react";
import {AuthContext} from "../context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import Toast from "../components/Toast.jsx";
const UserRegister = () => {
  const [location, setLocation] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({});
  const [readableAddress, setReadableAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {setIsAuthenticated, setUserData} = useContext(AuthContext);
  const navigate = useNavigate();
  const mapElement = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: {errors, isSubmitting},
  } = useForm();

  const handleClickOutside = (event) => {
    if (mapElement.current && !mapElement.current.contains(event.target)) {
      setShowMap(false);
    }
  };

  useEffect(() => {
    if (showMap) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMap]);

  const onSubmit = async (data) => {
    try {
      data = {...data, location: JSON.stringify(location)};
      setIsAuthenticated(false);
      const formData = new FormData();
      for (const key in data) {
        if (key === "profilePhoto" && data[key][0]) {
          formData.append("profilePhoto", data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/registeruser`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const res = await response.json();
        setIsAuthenticated(true);
        setUserData(res.data.user);
        console.log("res", res);
        navigate("/");
      } else {
        let data = await response.json();
        console.log(data.message);
        setToastData({
          message: data.message,
          duration: 3000,
          type: "failure",
        });
        setShowToast(true);
      }
    } catch (error) {
      console.log(
        "some unexpected error occured while registering the uses",
        error
      );
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {latitude, longitude} = position.coords;
        const address = await getReadableAddress(latitude, longitude);
        setReadableAddress(address);
        setValue("location", {lat: latitude, lng: longitude});
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        alert("Unable to retrieve your location.");
        console.error(error);
      },
      {
        enableHighAccuracy: true, // Requests GPS accuracy
        timeout: 10000, // Wait 10 seconds before failing
        maximumAge: 0, // Forces a fresh location fetch
      }
    );
  };

  const handleLocationSelect = async (selectedLocation) => {
    const {lat, lng} = selectedLocation;
    const address = await getReadableAddress(lat, lng);
    setReadableAddress(address);
    setValue("location", {lat, lng});
    setLocation({lat, lng});
    setShowMap(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#02010A] bg-gray-200">
      <div className="w-full max-w-4xl p-8 dark:bg-[#04052E] bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold dark:text-white text-[#140152] text-center mb-6">
          User Registration
        </h1>
        <form
          className="grid grid-cols-2 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/*Name Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              {...register("name", {
                minLength: {value: 3, message: "Min length is 3"},
              })}
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 rounded-lg shadow-sm border  focus:ring-[#22007C]"
            />
            {errors.name && (
              <span className="text-xs text-red-700">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Username Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
            >
              Username <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              {...register("username", {
                required: {value: true, message: "username is required"},
                minLength: {value: 3, message: "Min length is 3"},
                maxLength: {value: 12, message: "Max length is 12"},
              })}
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 rounded-lg shadow-sm border  focus:ring-[#22007C]"
              required
            />
            {errors.username && (
              <span className="text-xs text-red-700">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 rounded-lg shadow-sm border  focus:ring-[#22007C]"
              required
            />
            {errors.email && (
              <span className="text-xs text-red-700">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
            >
              Password <span className="text-orange-600">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              {...register("password", {
                required: {value: true, message: "password is required"},
                minLength: {value: 4, message: "Min length is 4"},
                maxLength: {value: 10, message: "Max length is 10"},
              })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 rounded-lg shadow-sm border  focus:ring-[#22007C]"
            />
            {errors.password && (
              <span className="text-xs text-red-700">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Profile Photo Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="profilePhoto"
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
            >
              Profile Photo
            </label>
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              {...register("profilePhoto")}
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 rounded-lg shadow-sm border  focus:ring-[#22007C]"
              accept="image/*"
            />
          </div>

          {/* Location Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium dark:text-gray-300 text-[#140152] mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={readableAddress}
              {...register("location")}
              placeholder="Select your location"
              className="w-full px-4 py-2 dark:bg-[#140152] bg-white dark:text-white text-[#140152] dark:border-gray-600 border-gray-400 focus:outline-none dark:focus:ring-2 focus:ring-1 rounded-lg shadow-sm border  focus:ring-[#22007C]"
              style={{caretColor: "transparent"}}
            />
            {errors.location && (
              <span className="text-red-700">{errors.location.message}</span>
            )}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                name="location"
                onClick={getCurrentLocation}
                className="bg-[#22007C] hover:bg-[#140152] text-white px-4 py-2 rounded-lg shadow-md cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="border-t-2 border-white border-solid rounded-full w-5 h-5 animate-spin"></div>
                ) : (
                  "Use Current Location"
                )}
              </button>

              <button
                type="button"
                name="location"
                onClick={() => setShowMap(true)}
                className="dark:bg-[#04052E] dark:text-gray-200 border dark:border-gray-400 border-[#140152] bg-white text-[#140152] px-4 py-2 rounded-lg cursor-pointer"
              >
                Select on Map
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 bg-[#22007C] text-white font-semibold rounded-lg hover:bg-[#1a005f] transition-colors"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      {showMap && (
        <div className="fixed w-full h-full flex items-center justify-center top-0 p-3">
          <MapComponent
            ref={mapElement}
            onLocationSelect={handleLocationSelect}
            setShowMap={setShowMap}
            readableAddress={readableAddress}
          />
        </div>
      )}
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

export default UserRegister;
