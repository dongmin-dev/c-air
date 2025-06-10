import React, { useState } from "react";
import authService from "../services/authService";
import "./LoginPage.css"; // We will create this CSS file next

const LoginPage = () => {
  const [cno, setCno] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setError(""); // Clear previous errors

    try {
      await authService.login(cno, passwd);
      // On successful login, the authService saves user info.
      // We can now redirect the user to the main page.
      // For now, we'll just reload to a "logged in" state.
      window.location.href = "/"; // Redirect to home page
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
            {/* Per project requirements, this link is non-functional. */}
            <a href="#">비밀번호를 잊으셨나요?</a>
          </div>

          <button type="submit" className="login-button">
            계속
          </button>
        </form>
        <div className="signup-link">
          {/* Per project requirements, this link is non-functional. */}
          <span>계정이 없으신가요? </span>
          <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
