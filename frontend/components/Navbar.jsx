import React from "react";
// Import các components chuẩn của Clerk
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export default function AppNavbar() {
  return (
    // Toàn bộ thanh Navbar với tone màu tối chủ đạo giống ảnh mẫu, kèm border mỏng ở chân
    <div className="navbar bg-[#141416] text-[#a0a0a5] h-20 px-4 sm:px-8 border-b border-zinc-800 sticky top-0 z-50">
      {/* LỀ TRÁI: LOGO BAOLINGO */}
      <div className="navbar-start gap-2">
        {/* Menu Hamburger thu gọn cho thiết bị Mobile */}
        <div className="dropdown lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-2xl bg-[#1c1c1e] rounded-box w-52 text-gray-300 gap-y-1 border border-zinc-800"
          >
            <li>
              <a href="#">Luyện tập</a>
            </li>
            <li>
              <a href="#">Từ vựng</a>
            </li>
            <li>
              <a href="#">Ngữ pháp</a>
            </li>
            <li>
              <a href="#" className="justify-between">
                Luyện thi HSK
                <span className="badge badge-sm bg-[#e06d53] border-none text-white text-[9px] uppercase font-bold">
                  Mới
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Khối hiển thị Logo & Tên ứng dụng */}
        <a
          href="#"
          className="flex items-center gap-3 hover:opacity-95 transition-opacity"
        >
          <span className="text-2xl font-black text-[#d67b7b] tracking-wide font-sans">
            Baolingo
          </span>
        </a>
      </div>

      {/* KHU VỰC GIỮA: DANH SÁCH MENU ĐIỀU HƯỚNG (DESKTOP) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-x-6 text-sm font-semibold text-[#dddddf]">
          <li>
            <a
              href="#"
              className="hover:text-white hover:bg-[#d67b7b] transition-colors py-2 px-3 rounded-lg"
            >
              Luyện tập
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-white hover:bg-[#d67b7b] transition-colors py-2 px-3 rounded-lg"
            >
              Từ vựng
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-white hover:bg-[#d67b7b] transition-colors py-2 px-3 rounded-lg"
            >
              Ngữ pháp
            </a>
          </li>

          {/* Mục "Luyện thi HSK" đi kèm Badge "MỚI" đặt tuyệt đối lên góc */}
          <li className="relative">
            <a
              href="#"
              className="hover:text-white hover:bg-[#d67b7b] transition-colors py-2 px-3 rounded-lg"
            >
              Luyện thi HSK
              <span className="absolute -top-1.5 -right-2 bg-[#e06d53] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90">
                Mới
              </span>
            </a>
          </li>
        </ul>
      </div>

      {/* KHU VỰC PHẢI: ICON TIỆN ÍCH & ĐĂNG NHẬP */}
      <div className="navbar-end gap-4 text-[#dddddf]">
        {/* Nút bật/tắt giao diện tối (Moon Icon) */}
        <button className="btn btn-ghost btn-circle btn-sm hover:bg-zinc-800/60 text-[#dddddf]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        {/* --- TÍCH HỢP CLERK AUTHENTICATION Ở ĐÂY --- */}

        {/* Trường hợp 1: Chưa đăng nhập -> Hiện nút Đăng nhập */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm font-bold text-white hover:text-[#d67b7b] transition-colors pl-2 cursor-pointer">
              Đăng nhập
            </button>
          </SignInButton>
        </SignedOut>

        {/* Trường hợp 2: Đã đăng nhập -> Hiện nút Avatar Profile của User */}
        <SignedIn>
          <div className="flex items-center justify-center pl-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 rounded-full border border-zinc-700",
                },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
