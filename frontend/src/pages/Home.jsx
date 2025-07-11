import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../context/AuthProvider.jsx";
import getReadableAddress from "../utils/getReadableAddress";
import calculateDistance from "../utils/getDistance.js";

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const {userData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setError,
    watch,
    formState: {errors, isSubmitted},
  } = useForm();
  const queryText = watch("query");

  const defaultData = async () => {
    setSearchResults([]);
    const cachedData = sessionStorage.getItem("spResults");
    if (cachedData) {
      setSearchResults(JSON.parse(cachedData));
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/general-sp-data`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setSearchResults(data);
      } else {
        const serviceProviders = data.data.serviceProviderData;

        const updatedServiceProviders = await Promise.all(
          serviceProviders.map(async (sp) => {
            let pointA;
            let pointB;
            if (sp.location) {
              const {lat, lng} = JSON.parse(sp.location);
              pointA = {lat, lng};
              sp.humanReadableAddress = await getReadableAddress(lat, lng);
              sp.coordinates = {lat, lng};
            }
            if (userData.location) {
              const {lat, lng} = JSON.parse(userData.location);
              pointB = {lat, lng};
              const distance = calculateDistance(pointA, pointB);
              sp.distanceFromCurrentUser = distance;
            }
            return sp;
          })
        );
        sessionStorage.setItem(
          "spResults",
          JSON.stringify(updatedServiceProviders)
        );
        setSearchResults(updatedServiceProviders);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (queryText === "" || !queryText) {
      defaultData();
    }
  }, [userData, queryText]);

  const onSubmit = async (query) => {
    setLoading(true);
    setSearchResults([]);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/user/search/service-provider?profession=${query.query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setSearchResults(data);
      } else {
        const serviceProviders = data.data.serviceProviderData;

        const updatedServiceProviders = await Promise.all(
          serviceProviders.map(async (sp) => {
            let pointA;
            let pointB;
            if (sp.location) {
              const {lat, lng} = JSON.parse(sp.location);
              pointA = {lat, lng};
              sp.humanReadableAddress = await getReadableAddress(lat, lng);
              sp.coordinates = {lat, lng};
            }
            if (userData.location) {
              const {lat, lng} = JSON.parse(userData.location);
              pointB = {lat, lng};
              const distance = calculateDistance(pointA, pointB);
              sp.distanceFromCurrentUser = distance;
            }
            return sp;
          })
        );

        setSearchResults(updatedServiceProviders);
      }
    } catch (error) {
      console.log(error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const viewOnMap = (location) => {
    if (typeof location == String) return;
    const {lat, lng} = location;
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
  };

  const handleCardClick = (searchedSP) => {
    sessionStorage.setItem("searchResults", JSON.stringify(searchResults));
    navigate("/sp-detailed-profile", {state: {searchedSP}});
  };
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-[#02010A] bg-gray-200 min-h-screen w-full">
      {/* Search Section */}
      <div className="mb-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center mb-6"
        >
          <input
            type="text"
            name="search"
            {...register("query")}
            placeholder="Search Service Providers..."
            className="px-4 py-2 border border-gray-600 rounded-l-lg w-1/2 text-white bg-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#4F46E5] text-white rounded-r-lg hover:bg-[#3730A3] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          >
            Search
          </button>
        </form>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center text-lg text-[#22007C]">
          Loading...
        </div>
      )}

      {searchResults.status === "error" ? (
        <p className="text-red-700 text-center">{searchResults.message}</p>
      ) : null}
      {/* Service Provider Cards */}
      <div className="space-y-8">
        {Array.isArray(searchResults) &&
          searchResults.map((sp, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(sp)}
              className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-[#1a1a4d] to-[#2c2c54] border border-[#110031] rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center gap-8 cursor-pointer"
            >
              {/* Left Section - Profile Image */}
              <img
                src={sp.profilePhoto || "/users.png"}
                alt="SP Profile"
                className="w-36 h-36 rounded-full border-4 border-[#4A90E2] mb-6 md:mb-0 transition-transform duration-300 transform hover:scale-105"
              />
              {/* Right Section - Service Provider Info */}
              <div className="text-white flex-1">
                <h3 className="text-3xl font-medium text-[#4A90E2]">
                  {sp.name || "Service Provider Name"}
                </h3>

                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-[#4A90E2] mr-2">
                      Email:
                    </span>{" "}
                    <span className="text-[#D1D1D1]">{sp.email}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-[#4A90E2] mr-2">
                      Phone:
                    </span>{" "}
                    <span className="text-[#8e6de8]">{sp.phoneNumber}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-[#4A90E2] mr-2">
                      Profession:
                    </span>
                    <span className="text-[#D1D1D1]">{sp.profession}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-[#4A90E2] mr-2">
                      Location:
                    </span>
                    <span className="text-[#D1D1D1] leading-relaxed">
                      {sp.humanReadableAddress}
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-[#4A90E2] mr-2">
                      Distance:
                    </span>
                    <span className="text-[#D1D1D1] leading-relaxed">
                      {sp.distanceFromCurrentUser ||
                        "your location is not provided"}
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewOnMap(sp.coordinates);
                    }}
                    className="text-[#4A90E2] hover:underline transition-colors duration-300"
                  >
                    Locate on Google Map
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
