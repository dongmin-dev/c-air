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
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  // The 'user' state is now managed here, in the top-level component.
  const [user, setUser] = useState(null);

  // This effect checks localStorage on initial load only.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Pass the user state and the setUser function to the Header */}
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
