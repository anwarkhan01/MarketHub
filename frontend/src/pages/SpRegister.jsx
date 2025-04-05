import React from "react";
import {useState, useRef, useEffect} from "react";
import MapComponent from "../components/MapComponent.jsx";
import getReadableAddress from "../utils/getReadableAddress.js";
import {useContext} from "react";
import {AuthContext} from "../context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";

const SpRegister = () => {
  const [location, setLocation] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [readableAddress, setReadableAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {setIsAuthenticated} = useContext(AuthContext);
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
      setShowMap(false); // Hide overlay if click is outside
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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/service-provider/register-sevice-provider`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const res = await response.json();
        setIsAuthenticated(true); // Update the auth state
        navigate("/");
      }
      // else {
      //   console.error("Login failed");
      //   navigate("/auth");
      // }
    } catch (error) {
      console.log("errorr", error);
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
    <div className="min-h-screen flex items-center justify-center bg-[#02010A] ">
      <div className="w-full max-w-5xl p-8 bg-[#04052E] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Service Provider Registration
        </h1>
        <form
          className="grid grid-cols-2 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Full Name Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              {...register("fullname", {
                required: {value: true, message: "fullname is required"},
              })}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.fullname && (
              <span className="text-red-700">{errors.fullname.message}</span>
            )}
          </div>

          {/* Username Field */}
          <div className="col-span-2 md:col-span-1">
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
              {...register("username", {
                required: {value: true, message: "username is required"},
              })}
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.username && (
              <span className="text-red-700">{errors.username.message}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              {...register("email", {
                required: {value: true, message: "email is required"},
              })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.email && (
              <span className="text-red-700">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="col-span-2 md:col-span-1">
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
              {...register("password", {
                required: {value: true, message: "This field is required"},
                minLength: {value: 3, message: "Min length is 3"},
              })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.password && (
              <span className="text-red-700">{errors.password.message}</span>
            )}
          </div>

          {/* Location Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={readableAddress}
              {...register("location", {
                required: {value: true, message: "locaton is required"},
              })}
              placeholder="Select your location"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.location && (
              <span className="text-red-700">{errors.location.message}</span>
            )}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                name="location"
                onClick={getCurrentLocation}
                className="bg-[#22007C] text-white px-4 py-2 rounded-lg shadow-md"
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
                className="bg-[#04052E] text-white px-4 py-2 rounded-lg shadow-md"
              >
                Select on Map
              </button>
            </div>
          </div>

          {/* Profession Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="profession"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Profession
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              {...register("profession", {
                required: {value: true, message: "profession is required"},
              })}
              placeholder="Enter your profession"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.profession && (
              <span className="text-red-700">{errors.profession.message}</span>
            )}
          </div>

          {/* Profession Description Field */}
          <div className="col-span-2">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              About
            </label>
            <textarea
              id="professionDescription"
              name="about"
              {...register(
                "about"
                // {
                // required: {
                //   value: true,
                //   message: "profession description is required",
                // },
                // }
              )}
              placeholder="write about you and your profession"
              rows="3"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.about && (
              <span className="text-red-700">{errors.about.message}</span>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              {...register("phoneNumber", {
                required: {value: true, message: "phone number is required"},
                minLength: {value: 10, message: "mininum lenght is 10"},
                maxLength: {value: 10, message: "maximum length is 10"},
              })}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
            />
            {errors.phoneNumber && (
              <span className="text-red-700">{errors.phoneNumber.message}</span>
            )}
          </div>

          {/* Profile Photo Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="profilePhoto"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Profile Photo
            </label>
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              {...register("profilePhoto", {required: "Image is required"})}
              className="w-full px-4 py-2 bg-[#140152] text-gray-300 rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
              accept="image/*"
            />
          </div>

          {/* Work Images Field */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="workImages"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Work Images
            </label>
            <input
              type="file"
              id="workImages"
              name="workImages"
              {...register("workImages")}
              className="w-full px-4 py-2 bg-[#140152] text-gray-300 rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
              accept="image/*"
              multiple
            />
          </div>

          {/* Experience Field */}
          <div className="col-span-2">
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Experience
            </label>
            <textarea
              id="experience"
              name="experience"
              {...register("experience")}
              placeholder="Describe your work experience"
              rows="3"
              className="w-full px-4 py-2 bg-[#140152] text-white rounded-lg shadow-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
              // required
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
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
    </div>
  );
};

export default SpRegister;
