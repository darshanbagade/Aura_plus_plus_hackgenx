import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Analytics from "@/pages/Analytics";
import Tasks from "@/pages/Tasks";
import LiveFootage from "@/pages/LiveFootage";
import CrewManagement from "@/pages/CrewManagement";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <Navigate to="/dashboard" replace /> }, // Redirect root to dashboard
        { path: "dashboard", element: <Dashboard /> },
        { path: "tasks", element: <Tasks /> },
        { path: "analytics", element: <Analytics /> },
        { path: "crew-management", element: <CrewManagement /> },
        { path: "live-footage", element: <LiveFootage /> },


        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

const Root = () => {
  return <RouterProvider router={router} />;
};

export default Root;