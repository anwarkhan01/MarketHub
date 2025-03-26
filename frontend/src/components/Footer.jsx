import React from "react";
import {useNavigate} from "react-router";
import {Link} from "react-router";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gradient-to-b from-[#04052E] to-[#02010A] text-white py-10">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-2xl font-bold tracking-wider">MarketHub</h2>
          <p className="text-sm opacity-75 mt-2 max-w-xs">
            Connecting you with local service providers seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-center md:text-left">
          <a href="#" className="hover:text-[#140152] transition-all">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#140152] transition-all">
            Terms of Service
          </a>
          <Link to="contact" className="hover:text-[#140152] transition-all">
            Contact Us
          </Link>
          <Link
            to="about"
            className="hover:text-[#140152] transition-all"
            onClick={() => navigate("/about")}
          >
            About Us
          </Link>
          <a href="#" className="hover:text-[#140152] transition-all">
            FAQs
          </a>
          <a href="#" className="hover:text-[#140152] transition-all">
            Support
          </a>
        </div>
      </div>

      <div className="border-t border-[#140152] mt-6 pt-4 text-center text-sm">
        <p className="opacity-75">
          &copy; {new Date().getFullYear()} MarketHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
