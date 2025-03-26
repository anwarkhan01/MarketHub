import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#02010A] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-gray-300 text-lg">Know More About Us</p>
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#22007C] to-[#140152]">
            Who We Are
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#04052E] p-6 rounded-lg border border-[#140152] shadow-md">
            <h2 className="text-xl font-semibold mb-2">🚀 Our Mission</h2>
            <p className="text-gray-400">
              Our mission is to bridge the gap between customers and service
              providers by offering a reliable platform with verified
              professionals and customer reviews.
            </p>
          </div>

          <div className="bg-[#04052E] p-6 rounded-lg border border-[#140152] shadow-md">
            <h2 className="text-xl font-semibold mb-2">🎯 Our Vision</h2>
            <p className="text-gray-400">
              To become the most trusted platform where people can instantly
              find skilled service providers around them, ensuring hassle-free
              services.
            </p>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-center text-gray-400">
            MarketHub was created to solve a simple problem — helping people
            connect with local service providers like electricians, plumbers,
            and more without any hassle. Our platform ensures verified services
            with transparent customer reviews.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
