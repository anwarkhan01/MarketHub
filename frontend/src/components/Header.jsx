import React from "react";
import {NavLink, useNavigate} from "react-router";
import {useContext, useState, useRef, useEffect} from "react";
import {AuthContext} from "../context/AuthProvider";
import {Menu} from "lucide-react";
import ThemeToggle from "./ToggleTheme";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {userData} = useContext(AuthContext);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();

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
    <header className="dark:bg-[#140152] bg-gray-100 shadow-md px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <h2 className="text-xl md:text-2xl font-bold text-[#3c247c]">
          Markethub
        </h2>
        <div className="flex md:hidden">
          <div className="mr-5">
            <ThemeToggle />
          </div>
          {/* Toggle button for mobile */}
          <button
            ref={toggleRef} // Add reference to toggle button
            className="dark:text-white text-black md:hidden block focus:outline-none"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((prev) => !prev)} // Toggle state correctly
          >
            <Menu />
          </button>
        </div>

        <nav
          ref={menuRef}
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row items-center md:space-x-6 text-lg font-medium w-full md:w-auto mt-4 md:mt-0 absolute md:relative top-full left-0 bg-[#140152] md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 mr-24`}
        >
          <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
            <li>
              <NavLink
                to="/"
                className={({isActive}) =>
                  isActive
                    ? "text-[#22007C] border-b-2 border-[#22007C] pb-1"
                    : "dark:text-white text-[#22007C] hover:text-[#04052E]"
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="md:hidden">
              <NavLink
                to={userData.role === "user" ? "user-profile" : "sp-profile"}
                className={({isActive}) =>
                  isActive
                    ? "text-[#22007C] border-b-2 border-[#22007C] pb-1"
                    : "text-white hover:text-[#04052E]"
                }
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="about"
                className={({isActive}) =>
                  isActive
                    ? "text-[#22007C] border-b-2 border-[#22007C] pb-1"
                    : "dark:text-white text-[#22007C] hover:text-[#04052E]"
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
                    : "dark:text-white text-[#22007C] hover:text-[#04052E]"
                }
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Profile Section */}
        <div
          className="hidden md:flex w-10 h-10 bg-[#22007C] rounded-full overflow-hidden items-center justify-center"
          onClick={() =>
            userData && userData.role === "user"
              ? navigate("/user-profile")
              : navigate("/sp-profile")
          }
        >
          <img
            src={(userData && userData?.profilePhoto) || "/users.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute right-50 md:block hidden ">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
