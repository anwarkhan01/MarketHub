import React from "react";
import {NavLink, useNavigate} from "react-router";
import {useContext, useState, useRef, useEffect} from "react";
import {AuthContext} from "../context/AuthProvider";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {userData} = useContext(AuthContext);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  // const [profilePic, setProfilePic] = useState(userData?.profilePhoto || "");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) && // Click outside menu
        toggleRef.current &&
        !toggleRef.current.contains(event.target) // Click outside toggle button
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="bg-[#140152] shadow-md px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <h2 className="text-xl md:text-2xl font-bold text-[#3c247c]">
          Markethub
        </h2>

        {/* Toggle button for mobile */}
        <button
          ref={toggleRef} // Add reference to toggle button
          className="text-white md:hidden block focus:outline-none"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((prev) => !prev)} // Toggle state correctly
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Navigation (Dropdown for mobile) */}
        <nav
          ref={menuRef}
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row items-center md:space-x-6 text-lg font-medium w-full md:w-auto mt-4 md:mt-0 absolute md:relative top-full left-0 bg-[#140152] md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 md:mr-24`}
        >
          <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
            <li>
              <NavLink
                to="/"
                className={({isActive}) =>
                  isActive
                    ? "text-[#22007C] border-b-2 border-[#22007C] pb-1"
                    : "text-white hover:text-[#04052E]"
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="about"
                className={({isActive}) =>
                  isActive
                    ? "text-[#22007C] border-b-2 border-[#22007C] pb-1"
                    : "text-white hover:text-[#04052E]"
                }
                onClick={() => setMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({isActive}) =>
                  isActive
                    ? "text-[#22007C] border-b-2 border-[#22007C] pb-1"
                    : "text-white hover:text-[#04052E]"
                }
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Profile Section (Hidden on mobile) */}
        <div
          className="hidden md:flex w-10 h-10 bg-[#22007C] rounded-full overflow-hidden items-center justify-center"
          onClick={() =>
            userData.role === "user"
              ? navigate("/user-profile")
              : navigate("/sp-profile")
          }
        >
          <img
            src={userData?.profilePhoto || null}
            alt="Profile"
            className="w-full h-full object-cover"
            // onError={(e) => (e.target.src = "")}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
