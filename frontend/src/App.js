import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import HistoryPage from "./pages/HistoryPage"; // Import the new page
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/book" element={<BookingConfirmationPage />} />
            <Route path="/history" element={<HistoryPage />} />{" "}
            {/* Add the history route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
