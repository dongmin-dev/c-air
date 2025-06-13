import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../CAIR-Logo-blue.png";
import "./Header.css";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-group-left">
          <div className="header-left">
            <Link to={user ? "/search" : "/"}>
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
            {/* Conditionally render the Admin link */}
            {user && user.cno === "cO" && (
              <Link to="/admin/stats" className="nav-link admin-link">
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="header-right">
          {user ? (
            <div className="user-info">
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
