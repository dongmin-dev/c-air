import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../CAIR-Logo-blue.png";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* This new wrapper groups the logo and nav links together */}
        <div className="header-group-left">
          <div className="header-left">
            <Link to="/search">
              <img src={logo} alt="C-AIR Logo" className="header-logo" />
            </Link>
          </div>
          <nav className="header-nav">
            <Link to="/search" className="nav-link">
              검색
            </Link>
            <Link to="/history" className="nav-link">
              내역 조회
            </Link>
          </nav>
        </div>
        <div className="header-right">
          {user ? (
            <div className="user-info">
              {/* This already displays the full name from the database */}
              <span className="user-name">{user.name}님</span>
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
