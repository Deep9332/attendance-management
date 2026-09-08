import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Dashboard() {
  const { user, students, attendance, setCurrentPage } = useContext(AppContext);
  const isAdmin = user?.role === "admin";

  // Get today's date formatted as YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayDateString();
  const todayRecord = attendance[todayStr] || null;

  // Calculate stats for today
  const totalStudents = students.length;
  let presentToday = 0;
  let absentToday = 0;

  if (todayRecord) {
    Object.values(todayRecord).forEach((status) => {
      if (status === "Present") presentToday++;
      if (status === "Absent") absentToday++;
    });
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Summary Hero Banner */}
      <div className={`dashboard-hero ${isAdmin ? "hero-admin" : "hero-user"}`}>
        <div className="hero-text-content">
          <h1>{isAdmin ? "👑 Admin Control Panel" : "👤 User View Panel"}</h1>
          <p>
            {isAdmin
              ? "Full access to add, edit, delete student records & mark attendance"
              : "Read-only access to view student directories, attendance & reports"}
          </p>
        </div>
        <div className="hero-date-badge">
          📅 <span>{todayStr}</span>
        </div>
      </div>

      {/* 3 Stats Cards Row */}
      <div className="stats-grid-dashboard">
        <div className="report-card blue-border">
          <div className="card-header-flex">
            <span>TOTAL STUDENTS</span>
            <div className="card-icon-badge blue-icon">👨‍🎓</div>
          </div>
          <h2>{totalStudents}</h2>
        </div>

        <div className="report-card green-border">
          <div className="card-header-flex">
            <span>PRESENT STUDENTS (TODAY)</span>
            <div className="card-icon-badge green-icon">✅</div>
          </div>
          <h2 style={{ color: "#10b981" }}>{presentToday}</h2>
        </div>

        <div className="report-card red-border">
          <div className="card-header-flex">
            <span>ABSENT STUDENTS (TODAY)</span>
            <div className="card-icon-badge red-icon">❌</div>
          </div>
          <h2 style={{ color: "#ef4444" }}>{absentToday}</h2>
        </div>
      </div>

      {/* Operations Directory section */}
      <h3 className="operations-section-title">
        {isAdmin ? "Admin Operations Directory" : "User Navigation Directory"}
      </h3>

      <div className="operations-grid">
        <div className="operation-card">
          <div className="operation-icon">👨‍🎓</div>
          <h3>{isAdmin ? "Manage Students" : "Student Directory"}</h3>
          <p>
            {isAdmin
              ? "Add new student names, edit roll numbers, and delete records."
              : "View the list of enrolled students and roll numbers (Read Only)."}
          </p>
          <button className="btn-op btn-op-outline" onClick={() => setCurrentPage("students")}>
            {isAdmin ? "Manage Students" : "View Students"}
          </button>
        </div>

        <div className="operation-card">
          <div className="operation-icon">📋</div>
          <h3>{isAdmin ? "Daily Attendance" : "Daily Attendance Sheets"}</h3>
          <p>
            {isAdmin
              ? "Mark attendance sheets (Present / Absent toggles) for any date."
              : "View attendance records and daily status for any selected date."}
          </p>
          <button className="btn-op btn-op-filled" onClick={() => setCurrentPage("attendance")}>
            {isAdmin ? "Mark Attendance" : "View Attendance"}
          </button>
        </div>

        <div className="operation-card">
          <div className="operation-icon">📈</div>
          <h3>{isAdmin ? "Reports & Summary" : "Reports & Analytics"}</h3>
          <p>
            {isAdmin
              ? "View complete attendance ratios, tables, and total summary cards."
              : "View all-time attendance rates, individual statistics, and date logs."}
          </p>
          <button className="btn-op btn-op-outline" onClick={() => setCurrentPage("reports")}>
            {isAdmin ? "Go to Reports" : "View Reports"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
