// https://coolors.co/palette/02010a-04052e-140152-22007c
// 02010A, 04052E, 140152, 22007C

import {createRoot} from "react-dom/client";
import "./index.css";
import {
  Outlet,
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  Home,
  About,
  AuthLayout,
  Login,
  UserLogin,
  UserRegister,
  UserProfile,
  SpLogin,
  SpRegister,
  SpProfile,
  ServiceProviderDetails,
} from "./indexes.jsx";
import MainLayout from "./Root.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import {useContext} from "react";
import {AuthContext} from "./context/AuthProvider.jsx";
import MapComponent from "./components/MapComponent.jsx";
import TestComponent from "./components/TestComponent.jsx";
import Contact from "./pages/Contact.jsx";

// Protect routes using this component
const PrivateRoute = () => {
  const {isAuthenticated, loading} = useContext(AuthContext);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

const NotFoundRedirect = () => {
  const {isAuthenticated} = useContext(AuthContext);
  return <Navigate to={isAuthenticated ? "/" : "/auth"} />;
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route element={<PrivateRoute />}>
          <Route path="" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="sp-profile" element={<SpProfile />} />
          <Route
            path="sp-detailed-profile"
            element={<ServiceProviderDetails />}
          />
        </Route>
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="user-login" element={<UserLogin />} />
        <Route path="sp-login" element={<SpLogin />} />
        <Route path="user-register" element={<UserRegister />} />
        <Route path="sp-register" element={<SpRegister />} />
      </Route>
      <Route path="*" element={<NotFoundRedirect />} />
    </>
  )
);
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    {/* <TestComponent /> */}
    {/* <MapComponent /> */}
  </AuthProvider>
);
