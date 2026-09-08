import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Home({ onOpenLogin }) {
  const { user, setCurrentPage } = useContext(AppContext);

  const handleGoToPortal = () => {
    if (user) {
      setCurrentPage("dashboard");
    } else {
      if (onOpenLogin) {
        onOpenLogin();
      } else {
        setCurrentPage("login");
      }
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="home-navbar">
        <div className="home-nav-brand">
          🏫 AttendancePro
        </div>
        <div className="home-nav-actions">
          <button className="btn btn-primary" onClick={handleGoToPortal}>
            {user ? "Dashboard" : "Login / Portal"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="hero-badge">BCA Sem 5 AWD Project</span>
          <h1>Student Attendance Management System</h1>
          <p>
            A simple, digital attendance tracking system with Admin & User panels, 
            daily marking sheets, and instant reports.
          </p>
          <button className="btn btn-primary btn-hero-lg" onClick={handleGoToPortal}>
            🚀 Launch Attendance Portal
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-section">
        <div className="section-title-wrapper">
          <h2>Project Features</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👑</div>
            <h3>Admin Panel</h3>
            <p>Full access to add, edit roll numbers & names, delete students, and mark attendance.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>User Panel</h3>
            <p>Clean read-only access to view student directories, attendance sheets, and reports.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Daily Attendance</h3>
            <p>Mark student presence/absence easily for any selected date with quick toggles.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Reports & Analytics</h3>
            <p>View all-time attendance rates %, student statistics, and date-filtered summary tables.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="home-section about-section">
        <div className="about-card">
          <h2>About The Project</h2>
          <p>
            This Student Attendance Management System is built for BCA Semester 5 
            (Advanced Web Development). It helps streamline classroom attendance tracking digitally.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} AttendancePro - BCA Sem 5 AWD Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
