import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import HistoryPage from "./pages/HistoryPage";
import CancellationPage from "./pages/CancellationPage";
import AdminStatsPage from "./pages/AdminStatsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import FloatingGitHubLink from "./components/FloatingGitHubLink"; // Import the new component
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/search" />
                ) : (
                  <LoginPage onLogin={setUser} />
                )
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cancel"
              element={
                <ProtectedRoute>
                  <CancellationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <AdminRoute>
                  <AdminStatsPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <FloatingGitHubLink /> {/* Add the floating button component here */}
      </div>
    </Router>
  );
}

export default App;
