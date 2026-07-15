import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
        <Route path="/analytics/:id" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
