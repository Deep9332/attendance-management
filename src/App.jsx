import { useContext } from "react";
import { AppProvider, AppContext } from "./context/AppContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import "./App.css";

function AppContent() {
  // Consume page state and login actions via useContext
  const { user, currentPage, setCurrentPage, logout } = useContext(AppContext);

  // If user is not logged in, render the Login screen
  if (!user) {
    return <Login />;
  }

  // Render correct page view component
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <Students />;
      case "attendance":
        return <Attendance />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Top Header Navigation */}
      <header className="app-header">
        <div className="header-logo" onClick={() => setCurrentPage("dashboard")}>
          🏫 AttendancePro
        </div>
        <nav className="header-nav">
          <button
            className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => setCurrentPage("dashboard")}
          >
            🏠 Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === "students" ? "active" : ""}`}
            onClick={() => setCurrentPage("students")}
          >
            👨‍🎓 Students
          </button>
          <button
            className={`nav-link ${currentPage === "attendance" ? "active" : ""}`}
            onClick={() => setCurrentPage("attendance")}
          >
            📅 Attendance
          </button>
          <button
            className={`nav-link ${currentPage === "reports" ? "active" : ""}`}
            onClick={() => setCurrentPage("reports")}
          >
            📊 Reports
          </button>
        </nav>
        <div className="header-user">
          <span className="user-badge">👤 Admin</span>
          <button className="btn btn-outline btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="app-main">{renderPage()}</main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Student Attendance Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  // Wrap entire application inside our AppProvider so context is available
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
