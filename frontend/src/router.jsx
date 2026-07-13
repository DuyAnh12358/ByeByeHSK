import { createBrowserRouter } from "react-router-dom";

import HomeLayout from "../layouts/HomeLayout";
import ProtectedHomeRoute from "./routes/ProtectedHomeRoute";

import Exams from "./pages/Exams";
import ExamsLanding from "./pages/ExamsLanding";
import ExamTake from "./pages/ExamTake";
import SkillPracticeTake from "./pages/SkillPracticeTake";



import VocabularyLevels from "./pages/Vocabulary/VocabularyLevels";
import VocabularyHSK1 from "./pages/Vocabulary/HSK1/VocabularyHSK1";
import VocabularyHSK2 from "./pages/Vocabulary/HSK2/VocabularyHSK2";
import VocabularyHSK3 from "./pages/Vocabulary/HSK3/VocabularyHSK3";
import VocabularyHSK4 from "./pages/Vocabulary/HSK4/VocabularyHSK4";
import VocabularyHSK5 from "./pages/Vocabulary/HSK5/VocabularyHSK5";
import VocabularyHSK6 from "./pages/Vocabulary/HSK6/VocabularyHSK6";
import VocabularyCustom from "./pages/Vocabulary/Custom/VocabularyCustom";


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
      {
        path: "thi-thu",
        index: true,
        element: <ExamsLanding />,
      },
      {
        path: "thi-thu/hsk/:level",
        element: <Exams />,
      },
      {
        path: "thi-thu/hsk/:level/exam/:examNumber",
        element: <ExamTake />,
      },
      {
        path: "thi-thu/hsk/:level/exam/:examNumber/skill/:skill",
        element: <SkillPracticeTake />,
      },

    ],
  },

  {
    path: "/tu-vung",
    element: <VocabularyLevels />,
  },

  {
    path: "/tu-vung/hsk1",
    element: <VocabularyHSK1 />,
  },
  {
    path: "/tu-vung/hsk2",
    element: <VocabularyHSK2 />,
  },
  {
    path: "/tu-vung/hsk3",
    element: <VocabularyHSK3 />,
  },
  {
    path: "/tu-vung/hsk4",
    element: <VocabularyHSK4 />,
  },
  {
    path: "/tu-vung/hsk5",
    element: <VocabularyHSK5 />,
  },
  {
    path: "/tu-vung/hsk6",
    element: <VocabularyHSK6 />,
  },
  {
    path: "/tu-vung/custom",
    element: <VocabularyCustom />,
  },
]);
