import { useContext, useState } from "react";
import { AppProvider, AppContext } from "./context/AppContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import "./App.css";

function AppContent() {
  const { user, currentPage, setCurrentPage, logout } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Unauthenticated Session Views
  if (!user) {
    if (currentPage === "home") {
      return <Home onOpenLogin={() => setCurrentPage("login")} />;
    }

    return (
      <div className="app-layout">
        <header className="app-header">
          <div className="header-logo" onClick={() => setCurrentPage("login")}>
            🏫 AttendancePro
          </div>
          <button className="btn btn-outline btn-logout" onClick={() => setCurrentPage("home")}>
            🌐 Project Info / Home
          </button>
        </header>
        <main className="app-main" style={{ padding: "1.5rem" }}>
          <Login />
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Student Attendance Management System. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Render correct page view component when logged in
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onOpenLogin={() => setCurrentPage("dashboard")} />;
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

  const isAdmin = user?.role === "admin";

  // Full-bleed Home page view when logged in
  if (currentPage === "home") {
    return (
      <div className="app-layout">
        <header className="app-header">
          <div className="header-brand-group">
            <div className="header-logo" onClick={() => setCurrentPage("dashboard")}>
              🏫 AttendancePro
            </div>
            <nav className="header-nav-shortcuts">
              <button className="nav-shortcut-btn active" onClick={() => setCurrentPage("home")}>
                🏠 Home
              </button>
              <button className="nav-shortcut-btn" onClick={() => setCurrentPage("dashboard")}>
                📊 Dashboard
              </button>
            </nav>
          </div>
          <div className="header-user">
            <span className={`user-badge ${isAdmin ? "badge-admin" : "badge-user"}`}>
              {isAdmin ? "👑 Admin Panel" : "👤 User Panel"}
            </span>
            <button className="btn btn-outline btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <main className="app-main-full">
          <Home onOpenLogin={() => setCurrentPage("dashboard")} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-dashboard-shell">
      {/* Mobile Toggle Button */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar Navigation"
      >
        ☰
      </button>

      {/* Left Sidebar Navigation */}
      <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand" onClick={() => setCurrentPage("dashboard")}>
          <div className="sidebar-logo-icon">🏫</div>
          <div className="sidebar-logo-text">
            <h2>AttendancePro</h2>
            <span>BCA Sem 5 Tracker</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <span className="menu-heading">MAIN MENU</span>

          <button
            className={`sidebar-link ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => { setCurrentPage("dashboard"); setSidebarOpen(false); }}
          >
            <span className="link-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`sidebar-link ${currentPage === "students" ? "active" : ""}`}
            onClick={() => { setCurrentPage("students"); setSidebarOpen(false); }}
          >
            <span className="link-icon">👨‍🎓</span>
            <span>Students Directory</span>
          </button>

          <button
            className={`sidebar-link ${currentPage === "attendance" ? "active" : ""}`}
            onClick={() => { setCurrentPage("attendance"); setSidebarOpen(false); }}
          >
            <span className="link-icon">📋</span>
            <span>Daily Attendance</span>
          </button>

          <button
            className={`sidebar-link ${currentPage === "reports" ? "active" : ""}`}
            onClick={() => { setCurrentPage("reports"); setSidebarOpen(false); }}
          >
            <span className="link-icon">📈</span>
            <span>Reports & Summary</span>
          </button>

          <span className="menu-heading">QUICK NAV</span>

          <button
            className={`sidebar-link ${currentPage === "home" ? "active" : ""}`}
            onClick={() => { setCurrentPage("home"); setSidebarOpen(false); }}
          >
            <span className="link-icon">🏠</span>
            <span>Project Home</span>
          </button>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-badge">
            <span className={`user-badge ${isAdmin ? "badge-admin" : "badge-user"}`}>
              {isAdmin ? "👑 Admin Panel" : "👤 User Panel"}
            </span>
          </div>
          <button className="btn btn-logout-sidebar btn-block" onClick={logout}>
            <span>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Dashboard Content Area */}
      <div className="app-main-wrapper">
        {/* Top Header Bar */}
        <header className="app-top-header">
          <div className="top-header-title">
            <h1>{currentPage.toUpperCase()}</h1>
          </div>

          <div className="top-header-actions">
            <span className="top-user-name">Welcome, <strong>{user.username}</strong></span>
            <span className={`user-badge ${isAdmin ? "badge-admin" : "badge-user"}`}>
              {isAdmin ? "👑 Admin" : "👤 User"}
            </span>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="app-content-container">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Student Attendance Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
