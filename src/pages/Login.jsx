import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Login() {
  const { login } = useContext(AppContext);

  // Empty state by default
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const usernameRef = useRef(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  // Click Admin option -> Auto-fill Admin credentials without logging in
  const handleSelectAdmin = () => {
    setSelectedRole("admin");
    setUsername("admin");
    setPassword("admin");
    setError("");
  };

  // Click User option -> Auto-fill User credentials without logging in
  const handleSelectUser = () => {
    setSelectedRole("user");
    setUsername("user");
    setPassword("user");
    setError("");
  };

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

    if (trimmedUser === "admin" && trimmedPass === "admin") {
      login("admin", "admin");
    } else if (trimmedUser === "user" && trimmedPass === "user") {
      login("user", "user");
    } else {
      if (selectedRole === "admin") {
        setError("Invalid Admin credentials! Use admin / admin");
      } else {
        login(trimmedUser, "user");
      }
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
            <label htmlFor="username">
              Username {selectedRole && <span className="role-tag-soft">({selectedRole})</span>}
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              ref={usernameRef}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setSelectedRole(null);
              }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setSelectedRole(null);
              }}
              required
            />
          </div>

          <button type="submit" className="btn btn-login-soft btn-block">
            Login
          </button>
        </form>

        {/* Role Selector Options Below Form Inputs */}
        <div className="role-selector-divider">
          <span>QUICK AUTO-FILL OPTIONS</span>
        </div>

        <div className="role-selector-row-soft">
          <button
            type="button"
            className={`role-select-btn-soft ${selectedRole === "admin" ? "active-admin-soft" : ""}`}
            onClick={handleSelectAdmin}
          >
            👑 Admin {selectedRole === "admin" && <span className="check-mark">✓</span>}
          </button>
          <button
            type="button"
            className={`role-select-btn-soft ${selectedRole === "user" ? "active-user-soft" : ""}`}
            onClick={handleSelectUser}
          >
            👤 User {selectedRole === "user" && <span className="check-mark">✓</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
