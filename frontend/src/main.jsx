import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
// 1. SỬA: Viết hoa chữ cái đầu của ClerkProvider
import { ClerkProvider } from "@clerk/clerk-react";
import { useSyncUserWithBackend } from "./hooks/useSyncUserWithBackend";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Component nhỏ để gọi hook đồng bộ user NGAY TẠI GỐC app - chạy đúng 1 lần
// mỗi khi đăng nhập, bất kể đang ở route/layout nào, không phụ thuộc việc
// từng trang có tự bọc HomeLayout hay không.
function AppRoot() {
  useSyncUserWithBackend();
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 2. SỬA: Dùng đúng tên component viết hoa và truyền key vào prop publishableKey */}
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppRoot />
    </ClerkProvider>
  </StrictMode>,
);