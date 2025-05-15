import React, {useContext, useEffect, useState, useRef} from "react";
import {AuthContext} from "../context/AuthProvider";
import getReadableAddress from "../utils/getReadableAddress";
import MapComponent from "../components/MapComponent.jsx";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
const SpProfile = () => {
  const {userData, setIsAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(
    (userData && userData.profilePhoto) || "/users.png"
  );
  const [isEditing, setIsEditing] = useState(false);
  // const [message, setMessage] = useState("");
  const [location, setLocation] = useState(userData && userData.location);
  const [showMap, setShowMap] = useState(false);
  const [readableAddress, setReadableAddress] = useState("");
  const mapElement = useRef();

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

  const getCurrentLocation = () => {
    // setIsLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {latitude, longitude} = position.coords;
        const address = await getReadableAddress(latitude, longitude);
        setReadableAddress(address);
        // setValue("location", {lat: latitude, lng: longitude});
        // setIsLoading(false);
      },
      (error) => {
        // setIsLoading(false);
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

    // Cleanup the event listener on unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMap]);

  useEffect(() => {
    const updateData = async () => {
      // editedData.location = "";
      for (const key in userData) {
        if (key === "location") {
          const {lat, lng} = JSON.parse(userData[key]);
          const humanReadableAddress = await getReadableAddress(lat, lng);
          setReadableAddress(humanReadableAddress);
          // setCurrenUserData((p) => ({...p, location: readableAddress}));
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
    // setValue("location", {lat, lng});
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
    data = {...data, location: JSON.stringify(location)};
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

          {/* Other fields  */}
          <div className="mt-6 space-y-4">
            {/* name  */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF]">Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  {...register("fullname")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                />
              ) : (
                <span>{userData.name || "Service Provider Name"}</span>
              )}
            </div>

            {/* email */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF]">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  {...register("email")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                  // required
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>
            {/* username  */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF]">Username:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("username")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                  required
                />
              ) : (
                <span>{userData.username}</span>
              )}
            </div>
            {/* phone  */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF]">Phone:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("phoneNumber")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                  required
                />
              ) : (
                <span>{userData.phoneNumber}</span>
              )}
            </div>
            {/* profession  */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF]">Profession:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("profession")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                  required
                />
              ) : (
                <span>{userData.profession}</span>
              )}
            </div>

            {/* about  */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF]">About:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("about")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                />
              ) : (
                <span>{userData.about}</span>
              )}
            </div>
            {/* experience  */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center">
              <span className="text-[#AAB3CF]">Experience:</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("experience")}
                  className="bg-transparent border-b border-white focus:outline-none text-white w-2/3 p-2 text-lg"
                />
              ) : (
                <span>{userData.experience}</span>
              )}
            </div>
            {/* location  */}
            <div className="flex justify-between border-b border-[#22007C] pb-2 items-center relative">
              <span className="text-[#AAB3CF]">Location:</span>
              {isEditing ? (
                <div className="flex w-2/3 items-center space-x-2">
                  <input
                    type="text"
                    value={readableAddress}
                    className="bg-transparent border-b border-white focus:outline-none text-white w-full p-2 text-lg"
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
                <span className="w-2/3 break-words">{readableAddress}</span>
              )}
            </div>
          </div>

          {/* edit */}
          <div className="mt-6 flex justify-between items-center">
            <button
              className="bg-[#22007C] text-white px-6 py-2 rounded-lg hover:bg-[#04052E] transition"
              type={isEditing ? "button" : "submit"}
              onClick={
                isEditing
                  ? () => setIsEditing(false)
                  : () => {
                      setIsEditing(true);
                      updateDatatoForm();
                    }
              }
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>

            {/* logout */}
            <button
              className="text-red-600 text-sm hover:underline transition"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* {message && (
            <div className="mt-4 text-green-500 text-center">{message}</div>
          )} */}
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
    </div>
  );
};

export default SpProfile;
