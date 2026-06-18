import { Routes, Route } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Service from "../pages/Service";
import Product from "../pages/Product";
import Help from "../pages/Help";
import Settings from "../pages/Settings";
import WorkerRegister from "../pages/WorkerRegister";
import WorkerDetail from "../pages/WorkerDetail";
import ProductRegister from "../pages/ProductRegister";
import ProductDetail from "../pages/ProductDetail";

import ProtectedRoute from "../components/ProtectedRoute";
import SearchResults from "../pages/SearchResults";
import MySubmissions from "../pages/MySubmissions";
import MyFavorites from "../pages/MyFavorites";
import Company from "../pages/Company";
import CompanyDetail from "../pages/CompanyDetail";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service"
          element={
            <ProtectedRoute>
              <Service />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker-register"
          element={
            <ProtectedRoute>
              <WorkerRegister />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker/:id"
          element={
            <ProtectedRoute>
              <WorkerDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product-register"
          element={
            <ProtectedRoute>
              <ProductRegister />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />


        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-submissions"
          element={
            <ProtectedRoute>
               <MySubmissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-favorites"
          element={
            <ProtectedRoute>
              <MyFavorites />
            </ProtectedRoute>
          }      
        />

        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <Company />
           </ProtectedRoute>
          }
        />


        <Route
          path="/company/:page"
          element={
            <ProtectedRoute>
              <CompanyDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


      </Routes>
      
  );
}

export default AppRoutes;