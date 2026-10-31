import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/admin/Dashboard.jsx";
import QuizDashboard from "./pages/admin/Quiz.jsx";
import { GlobalContext } from "./context/GlobalContext.jsx";
import EditDataQuiz from "./pages/admin/CRUD/EditDataQuiz.jsx";
import ArticleDashboard from "./pages/admin/Article.jsx";
import EditDataArticle from "./pages/admin/CRUD/EditDataArticle.jsx";
import PendidikanDashboard from "./pages/admin/Pendidikan.jsx";
import EditDataPendidikan from "./pages/admin/CRUD/EditDataPendidikan.jsx";
import EditDataHabitat from "./pages/admin/CRUD/EditDataHabitat.jsx";
import HabitatDashboard from "./pages/admin/Habitat.jsx";
import PerawatanDashboard from "./pages/admin/Perawatan.jsx";
import EditDataPerawatan from "./pages/admin/CRUD/EditDataPerawatan.jsx";
import SpesiesDashboard from "./pages/admin/Spesies.jsx";
import EditDataSpesies from "./pages/admin/CRUD/EditDataSpesies.jsx";
import MemoryCard from "./pages/MemoryCardGames.jsx";
import AnimalQuiz from "./pages/Quiz.jsx";
import HomePage from "./pages/Home.jsx";
import SpesiesPage from "./pages/Spesies.jsx";
import PendidikanPage from "./pages/Education.jsx";
import PerawatanPage from "./pages/Perawatan.jsx";
import HobiPage from "./pages/Habitat.jsx";
import HabitatPage from "./pages/Habitat.jsx";
import GamesPage from "./pages/Games.jsx";
import MiniGames from "./pages/MiniGames.jsx";
import MemoryCardDashboard from "./pages/admin/Quiz.jsx";
import EditDataMemoryCard from "./pages/admin/CRUD/EditDataMemoryCard.jsx";
import DetailPage from "./pages/Detail.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/games",
    element: <GamesPage />,
  },
  {
    path: "/mini-games",
    element: <MiniGames />,
  },
  {
    path: "/category",
    children: [
      {
        path: "spesies",
        element: <SpesiesPage />,
      },
      {
        path: "education",
        element: <PendidikanPage />,
      },
      {
        path: "perawatan",
        element: <PerawatanPage />,
      },
      {
        path: "habitat",
        element: <HabitatPage />,
      },
    ],
  },
  {
    path: "/quiz",
    element: <AnimalQuiz />,
  },
  {
    path: "/memory-card",
    element: <MemoryCard />,
  },
  {
    path: "detail/:slug",
    element: <DetailPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    children: [
      {
        index: true,
      },
      {
        path: "quiz",
        element: <QuizDashboard></QuizDashboard>,
      },
      {
        path: "quiz/:id_quiz",
        element: <EditDataQuiz />,
      },

      {
        path: "memory-card",
        element: <MemoryCardDashboard />,
      },
      {
        path: "memory-card/:id_card",
        element: <EditDataMemoryCard />,
      },
      {
        path: "article",
        element: <ArticleDashboard />,
      },
      {
        path: "article/:id_article",
        element: <EditDataArticle />,
      },
      {
        path: "pendidikan",
        element: <PendidikanDashboard />,
      },
      {
        path: "pendidikan/:id_pendidikan",
        element: <EditDataPendidikan />,
      },
      {
        path: "habitat",
        element: <HabitatDashboard />,
      },
      {
        path: "habitat/:id_habitat",
        element: <EditDataHabitat />,
      },
      {
        path: "perawatan",
        element: <PerawatanDashboard />,
      },
      {
        path: "perawatan/:id_perawatan",
        element: <EditDataPerawatan />,
      },
      {
        path: "spesies",
        element: <SpesiesDashboard />,
      },
      {
        path: "spesies/:id_spesies",
        element: <EditDataSpesies />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalContext>
      <RouterProvider router={router}></RouterProvider>
    </GlobalContext>
  </StrictMode>,
);
