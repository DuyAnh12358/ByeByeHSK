import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
// 1. SỬA: Viết hoa chữ cái đầu của ClerkProvider
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 2. SỬA: Dùng đúng tên component viết hoa và truyền key vào prop publishableKey */}
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
);
