import { createBrowserRouter } from "react-router-dom";

import HomeLayout from "../layouts/HomeLayout";
import ProtectedHomeRoute from "./routes/ProtectedHomeRoute";

import Home from "./pages/Home";
import VocabularyLevels from "./pages/Vocabulary/VocabularyLevels";
import VocabularyHSK1 from "./pages/Vocabulary/HSK1/VocabularyHSK1";
import VocabularyHSK2 from "./pages/Vocabulary/HSK2/VocabularyHSK2";
import VocabularyHSK3 from "./pages/Vocabulary/HSK3/VocabularyHSK3";
import VocabularyHSK4 from "./pages/Vocabulary/HSK4/VocabularyHSK4";
import VocabularyHSK5 from "./pages/Vocabulary/HSK5/VocabularyHSK5";
import VocabularyHSK6 from "./pages/Vocabulary/HSK6/VocabularyHSK6";


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

  {
    path: "/vocabularies",
    element: <VocabularyLevels />,
  },

  {
    path: "/vocabularies/hsk1",
    element: <VocabularyHSK1 />,
  },
  {
    path: "/vocabularies/hsk2",
    element: <VocabularyHSK2 />,
  },
  {
    path: "/vocabularies/hsk3",
    element: <VocabularyHSK3 />,
  },
  {
    path: "/vocabularies/hsk4",
    element: <VocabularyHSK4 />,
  },
  {
    path: "/vocabularies/hsk5",
    element: <VocabularyHSK5 />,
  },
  {
    path: "/vocabularies/hsk6",
    element: <VocabularyHSK6 />,
  },
]);

