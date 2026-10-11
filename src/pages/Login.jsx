import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Login() {
  const { login } = useContext(AppContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const usernameRef = useRef(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  // Manual Form Submit on clicking Login button
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError("Please enter both Username and Password.");
      return;
    }

    if (trimmedUser.toLowerCase() === "admin") {
      if (trimmedPass === "admin") {
        login("admin", "admin");
      } else {
        setError("Invalid Admin credentials! Use admin / admin");
      }
    } else {
      login(trimmedUser, "user");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card-soft">
        <h2>🔐 Attendance Login</h2>
        <p className="login-subtitle-soft">Sign in to access your portal</p>

        {error && <div className="error-message-soft">{error}</div>}

        {/* Standard Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group-soft">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group-soft">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-login-soft btn-block">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
