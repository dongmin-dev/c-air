import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage"; // Import the new SearchPage
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />{" "}
            {/* Add the route for the search page */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
