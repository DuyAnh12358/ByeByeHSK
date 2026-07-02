import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../components/Navbar";

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-[#141416] flex flex-col">
      {/* Navbar cố định ở trên đầu */}
      <AppNavbar />

      {/* Nội dung các trang con (Home, sau này có thể là Practice, Vocabulary...) render vào đây */}
      <main className="flex-1 w-full max-w-6xl mx-auto">
        <Outlet />
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