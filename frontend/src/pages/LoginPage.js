import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import authService from "../services/authService";
import "./LoginPage.css";

const LoginPage = () => {
  const [cno, setCno] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Get the navigate function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await authService.login(cno, passwd);
      // On successful login, navigate to the search page
      navigate("/search");
    } catch (err) {
      setError("Login failed. Please check your member number and password.");
      console.error(err);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="회원번호"
              value={cno}
              onChange={(e) => setCno(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="forgot-password-link">
            <a href="#">비밀번호를 잊으셨나요?</a>
          </div>

          <button type="submit" className="login-button">
            계속
          </button>
        </form>
        <div className="signup-link">
          <span>계정이 없으신가요? </span>
          <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
