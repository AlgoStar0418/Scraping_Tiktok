import React from "react";
import AuthHeader from "../components/headers/auth";
import LoginForm from "../components/forms/auth/LoginForm";
import { Route, Routes } from "react-router-dom";
import RegisterForm from "../components/forms/auth/RegisterForm";
import Notfound from "./Notfound";

const Auth = () => {
  return (
    <>
      <AuthHeader />
      <div className="bg-gray-50 h-screen">
        <div className="flex items-center justify-center h-full">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Auth;
