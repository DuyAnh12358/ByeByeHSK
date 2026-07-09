import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../components/Navbar";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#141416] flex flex-col">
      {/* Navbar cố định ở trên đầu */}
      <div className="py-5">
        <AppNavbar />
      </div>

      {/* Nội dung các trang con sẽ được render vào đây */}
      <main className="w-full px-4 py-20 flex flex-col gap-10 justify-center items-center">
        {children !== undefined ? children : <Outlet />}
      </main>

      <footer className="mt-auto border-t border-zinc-800 py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#a0a0a5]">
          <p>© {new Date().getFullYear()} ByeByeHSK · Học tiếng Trung mỗi ngày</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#d67b7b] transition-colors">Về chúng tôi</a>
            <a href="#" className="hover:text-[#d67b7b] transition-colors">Liên hệ</a>
            <a href="#" className="hover:text-[#d67b7b] transition-colors">Điều khoản</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
