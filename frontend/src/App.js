import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* We will add a Header component here later */}
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* Other pages like the flight search will be added here later */}
            {/* <Route path="/search" element={<SearchPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
