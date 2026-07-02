import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import ProtectedHomeRoute from "./routes/ProtectedHomeRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    // HomeLayout là layout route: chứa Navbar cố định + <Outlet /> để render các trang con bên trong
    element: <HomeLayout />,
    children: [
      {
        index: true, // Đường dẫn mặc định "/"
        element: <ProtectedHomeRoute />,
      },
      {
        path: "home",
        index: true,
        element: <ProtectedHomeRoute />,
      },
    ],
  },
]);

