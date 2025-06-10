import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header"; // Import the Header
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Add the Header component here */}
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
