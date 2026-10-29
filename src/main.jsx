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
const router = createBrowserRouter([
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
