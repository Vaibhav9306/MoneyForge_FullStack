import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/Landing/LandingPage";
import { AuthPage } from "../pages/Auth/AuthPage";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/signup",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <LandingPage />,
  },
]);
