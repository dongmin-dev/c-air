import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [cno, setCno] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await authService.login(cno, passwd);
      onLogin(response.user);
      navigate("/search");
    } catch (err) {
      // The opening brace was missing here
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
            <span
              className="tooltip-host pseudo-link"
              data-tooltip="이 기능은 구현되지 않았습니다."
            >
              비밀번호를 잊으셨나요?
            </span>
          </div>

          <button type="submit" className="login-button">
            계속
          </button>
        </form>
        <div className="signup-link">
          <span>계정이 없으신가요? </span>
          <span
            className="tooltip-host pseudo-link"
            data-tooltip="이 기능은 구현되지 않았습니다."
          >
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
