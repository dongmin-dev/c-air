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
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  // This effect checks the login status on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* If a user is logged in, redirect from '/' to '/search'.
              Otherwise, show the LoginPage.
            */}
            <Route
              path="/"
              element={user ? <Navigate to="/search" /> : <LoginPage />}
            />

            {/* These routes are now protected */}
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
