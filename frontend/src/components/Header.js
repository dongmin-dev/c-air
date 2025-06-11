import React from "react"; // No longer need useState or useEffect here
import { Link, useNavigate } from "react-router-dom";
import logo from "../CAIR-Logo-blue.png";
import "./Header.css";

// The component now receives 'user' and 'setUser' as props
const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Update the state in the top-level App component
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
