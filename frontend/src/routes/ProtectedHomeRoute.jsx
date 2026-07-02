import React from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Landing from "../pages/Landing";

export default function ProtectedHomeRoute() {
  return (
    <>
      {/* Chỉ render Home khi đã đăng nhập */}
      <SignedIn>
        {/* Điều hướng để URL hiển thị đúng là /home */}
        <Navigate to="/home" replace />
        <Home />
      </SignedIn>

      {/* Chưa đăng nhập -> render Landing ngay tại route "/" */}
      <SignedOut>
        <Landing />
      </SignedOut>
    </>
  );
}


