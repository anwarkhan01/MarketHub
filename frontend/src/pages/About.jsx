import React from "react";

const About = () => {
  return (
    <div className="bg-[#02010A] text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Title Section */}
        <div className="text-center mb-16">
          <p className="text-lg text-gray-400">Get to Know Us Better</p>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#22007C] to-[#140152]">
            Who We Are
          </h2>
        </div>

        {/* Mission and Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-[#04052E] p-8 rounded-lg border border-[#140152] shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#BB86FC] mb-4">
              🚀 Our Mission
            </h3>
            <p className="text-lg text-gray-400">
              Our mission is to bridge the gap between customers and service
              providers by offering a reliable platform with verified
              professionals and customer reviews.
            </p>
          </div>

          <div className="bg-[#04052E] p-8 rounded-lg border border-[#140152] shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#BB86FC] mb-4">
              🎯 Our Vision
            </h3>
            <p className="text-lg text-gray-400">
              To become the most trusted platform where people can instantly
              find skilled service providers around them, ensuring hassle-free
              services.
            </p>
          </div>
        </div>

        {/* Extra Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-[#04052E] p-8 rounded-lg border border-[#140152] shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-[#BB86FC] mb-4">
              ⚡ Fast & Reliable
            </h3>
            <p className="text-lg text-gray-400">
              We value your time — find skilled professionals quickly without
              endless browsing or uncertainty.
            </p>
          </div>

          <div className="bg-[#04052E] p-8 rounded-lg border border-[#140152] shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-[#BB86FC] mb-4">
              🌎 Local & Global
            </h3>
            <p className="text-lg text-gray-400">
              Whether you need a local handyman or specialized services,
              MarketHub connects you with the right experts around you.
            </p>
          </div>

          <div className="bg-[#04052E] p-8 rounded-lg border border-[#140152] shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-[#BB86FC] mb-4">
              🛠️ Skilled Service Providers
            </h3>
            <p className="text-lg text-gray-400 mb-4">
              MarketHub connects you with skilled professionals in your area,
              whether you're looking for a plumber, electrician, or any other
              expert.
            </p>
          </div>
        </div>

        {/* Long Paragraph Section */}
        <div className="mt-16 max-w-4xl mx-auto text-gray-400 space-y-6">
          <p className="text-lg">
            We believe that access to skilled professionals should be seamless
            and transparent. MarketHub removes the traditional barriers and
            introduces a new way to hire verified service providers.
          </p>
          <p className="text-lg">
            Our vision is not just limited to connecting users; we also empower
            local businesses to grow by providing them a platform to showcase
            their expertise, build trust, and reach a wider audience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
