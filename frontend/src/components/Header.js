import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../CAIR-Logo-blue.png"; // Make sure the logo is in src
import "./Header.css"; // We will create this CSS file next

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user info exists in localStorage when the component loads
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear user info from localStorage and state, then redirect to login
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="C-AIR Logo" className="header-logo" />
          </Link>
        </div>
        <nav className="header-nav">
          {/* We will add functionality to these links later */}
          <Link to="/search" className="nav-link">
            검색
          </Link>
          <Link to="/history" className="nav-link">
            내역 조회
          </Link>
        </nav>
        <div className="header-right">
          {user ? (
            <div className="user-info">
              <span className="user-name">{user.NAME}님</span>
              <button onClick={handleLogout} className="logout-button">
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/" className="login-button-header">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
