import React, {useContext, useEffect, useState, useRef} from "react";
import {AuthContext} from "../context/AuthProvider";
import getReadableAddress from "../utils/getReadableAddress";
import MapComponent from "../components/MapComponent.jsx";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import Toast from "../components/Toast.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

const SpProfile = () => {
  const {userData, setIsAuthenticated, setUserData} = useContext(AuthContext);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(
    (userData && userData.profilePhoto) || "/users.png"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState(userData && userData.location);
  const [showMap, setShowMap] = useState(false);
  const [readableAddress, setReadableAddress] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({});
  const [showProgressBar, setShowProgressBar] = useState(false);
  const mapElement = useRef();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {dirtyFields},
  } = useForm();

  const handleClickOutside = (event) => {
    if (mapElement.current && !mapElement.current.contains(event.target)) {
      setShowMap(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {latitude, longitude} = position.coords;
        const address = await getReadableAddress(latitude, longitude);
        setReadableAddress(address);
      },
      (error) => {
        alert("Unable to retrieve your location.");
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };
  useEffect(() => {
    if (showMap) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMap]);

  useEffect(() => {
    const updateData = async () => {
      for (const key in userData) {
        if (key === "location") {
          const {lat, lng} = JSON.parse(userData[key]);
          const humanReadableAddress = await getReadableAddress(lat, lng);
          setReadableAddress(humanReadableAddress);
        }
      }
    };
    updateData();
  }, [userData]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setIsAuthenticated(false);
      navigate("/login");
    }
    return;
  };
  const handleLocationSelect = async (selectedLocation) => {
    const {lat, lng} = selectedLocation;
    const address = await getReadableAddress(lat, lng);
    setReadableAddress(address);
    setLocation({lat, lng});
    setShowMap(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
      setValue("profilePhoto", file);
    }
  };

  const onSubmit = async (data) => {
    if (Object.keys(dirtyFields).length <= 0) {
      setIsEditing(false);
      return;
    }

    setShowProgressBar(true);
    data = {...data, location: JSON.stringify(location)};
    let updatedData = {};
    Object.keys(dirtyFields).forEach((key) => {
      updatedData[key] = data[key];
    });
    updatedData["username"] = userData.username;

    const formData = new FormData();
    for (const key in updatedData) {
      if (key === "profilePhoto" && updatedData[key][0]) {
        formData.append("profilePhoto", updatedData[key][0]);
      } else {
        formData.append(key, updatedData[key]);
      }
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/service-provider/update-sp-data`,
        {
          method: "PUT",
          headers: {
            Authrization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data.sp);
        setToastData({
          message: "Data Updated Successfully",
          type: "success",
        });
        setShowToast(true);
      } else {
        setToastData({
          message: "Some Error Occured",
          type: "failure",
        });
        setShowToast(true);
      }
    } catch (error) {
      console.log("error", error);
    }
    setShowProgressBar(false);
    setIsEditing(false);
    return true;
  };

  const updateDatatoForm = () => {
    for (const key in userData) {
      setValue(`${key}`, userData[key]);
    }
  };
  return (
    <div className="min-h-screen dark:bg-[#02010A] bg-gray-200 flex justify-center items-center p-6">
      {userData && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-[#140152] rounded-2xl shadow-lg p-8 text-white relative"
        >
          {/* profilePhoto  */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <label htmlFor="profilePhoto" className="cursor-pointer">
                <img
                  name="profilePhoto"
                  src={preview}
                  alt="Profile"
                  className={`w-32 h-32 rounded-full object-cover border-4 transition ${
                    isEditing ? "border-[#FFD700]" : "border-[#22007C]"
                  }`}
                />
              </label>
              {isEditing && (
                <input
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  {...register("profilePhoto")}
                  className="hidden"
                  onChange={handleFileChange}
                />
              )}
            </div>
          </div>

          {/* username  */}
          <div className="flex border-b border-[#22007C] pb-2 items-center">
            <span className="text-[#AAB3CF] min-w-[25%]">Username:</span>
            <span className="min-w-[75%]">{userData.username}</span>
          </div>

          {/* editable fields */}
          <div className="mt-6 space-y-4">
            {/* name  */}
            <div className="flex border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF] min-w-[25%]">Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  {...register("name")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                />
              ) : (
                <span className="min-w-[75%]">
                  {userData.name || "User Name"}
                </span>
              )}
            </div>

            {/* email */}
            <div className="flex border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF] min-w-[25%]">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  {...register("email")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                />
              ) : (
                <span className="min-w-[75%]">{userData.email}</span>
              )}
            </div>

            {/* phone  */}
            <div className="flex border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF] min-w-[25%]">Phone:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("phoneNumber")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                  required
                />
              ) : (
                <span className="min-w-[75%]">{userData.phoneNumber}</span>
              )}
            </div>
            {/* profession  */}
            <div className="flex  border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF] min-w-[25%]">Profession:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("profession")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                  required
                />
              ) : (
                <span className="min-w-[75%]">{userData.profession}</span>
              )}
            </div>

            {/* about  */}
            <div className="flex border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF] min-w-[25%]">About:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("about")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                />
              ) : (
                <span className="min-w-[75%]">{userData.about}</span>
              )}
            </div>
            {/* experience  */}
            <div className="flex border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF] min-w-[25%]">Experience:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("experience")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                />
              ) : (
                <span className="min-w-[75%]">{userData.experience}</span>
              )}
            </div>
            {/* location  */}
            <div className="flex border-b border-[#22007C] pb-2 items-center relative">
              <span className="text-[#AAB3CF] min-w-[25%]">Location:</span>
              {isEditing ? (
                <div className="flex w-2/3 items-center space-x-2">
                  <input
                    type="text"
                    value={readableAddress}
                    className="bg-transparent border-b border-white focus:outline-none text-white w-full p-2 text-lg"
                    readOnly
                  />
                  <button
                    className="text-[#FFD700] text-xl hover:text-white transition"
                    title="Update to current location"
                    onClick={getCurrentLocation}
                  >
                    📍
                  </button>
                  <button
                    className="text-[#FFD700] text-lg px-2 hover:text-white transition"
                    title="Select location on map"
                    onClick={() => setShowMap(true)}
                  >
                    🌍
                  </button>
                </div>
              ) : (
                <span className="w-2/3 break-words min-w-[75%]">
                  {readableAddress}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="buttons">
              <button
                className={`${
                  Object.keys(dirtyFields).length <= 0 && isEditing
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } bg-[#22007C] text-white px-6 py-2 rounded-lg hover:bg-[#04052E] transition`}
                type={isEditing ? "submit" : "button"}
                onClick={async (e) => {
                  e.preventDefault();
                  if (isEditing) {
                    const success = await handleSubmit(onSubmit)();
                    if (success) setIsEditing(false);
                  } else {
                    setIsEditing(true);
                    updateDatatoForm();
                  }
                }}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>

              <button
                className={`${
                  !isEditing ? "hidden" : ""
                } bg-[#22007C] text-white px-6 py-2 ml-2 rounded-lg hover:bg-[#04052E] transition`}
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
            {/* logout */}
            <button
              className="text-red-600 text-sm hover:underline transition"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </form>
      )}
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
          type={toastData.type}
          onclose={() => setShowToast(false)}
        />
      )}
      {showProgressBar && <ProgressBar />}
    </div>
  );
};

export default SpProfile;
