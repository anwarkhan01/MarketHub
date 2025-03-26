import React from "react";
import {Outlet} from "react-router-dom";
// import {Header, Footer} from "./index.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
const Root = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Root;
