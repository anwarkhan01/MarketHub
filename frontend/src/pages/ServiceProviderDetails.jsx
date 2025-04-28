import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

const ServiceProviderDetails = () => {
  const location = useLocation();
  const {searchedSP} = location.state || {};

  if (!searchedSP) {
    return (
      <div className="text-center text-white">
        No Service Provider Data Available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02010A] text-white flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-[#04052E] p-6 rounded-lg shadow-lg">
        {/* Profile Section */}
        <div className="flex items-center gap-6">
          <img
            src={searchedSP.profilePhoto || "/users.png"}
            alt={searchedSP.name}
            className="w-28 h-28 rounded-full border-4 border-[#22007C]"
          />
          <div>
            <h2 className="text-2xl font-bold text-[#22007C]">
              {searchedSP.name || "Service Provider"}
            </h2>
            <p className="text-sm text-gray-300">{searchedSP.profession}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-4">
          <p>
            <strong>Email:</strong> {searchedSP.email}
          </p>
          <p>
            <strong>Phone:</strong> {searchedSP.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {searchedSP.humanReadableAddress}
          </p>
          <p>
            <strong>About:</strong> {searchedSP.about}
          </p>
          <p>
            <strong>Experience:</strong> {searchedSP.experience}
          </p>
        </div>

        {/* Google Map */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold  text-[#22007C]">Location</h3>
          <iframe
            title="Google Map Location"
            width="100%"
            height="250"
            className="rounded-lg border-2 border-[#140152]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${searchedSP.coordinates?.lat},${searchedSP.coordinates?.lng}&hl=en&z=14&output=embed`}
          ></iframe>
        </div>

        {/* Actions */}
        {/* <div className="mt-6 flex justify-between">
          <button className="bg-[#22007C] text-white py-2 px-4 rounded-lg hover:bg-[#140152]">
            Book Service
          </button>
          <button className="bg-[#140152] text-white py-2 px-4 rounded-lg hover:bg-[#22007C]">
            Contact
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ServiceProviderDetails;
