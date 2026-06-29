import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../components/Navbar";

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-[#141416]">
      {/* Navbar cố định ở trên đầu */}
      <AppNavbar />
      
      {/* Nội dung các trang con sẽ được render vào đây */}
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}