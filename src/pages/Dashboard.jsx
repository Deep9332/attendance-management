import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Dashboard() {
  const { students, attendance, setCurrentPage } = useContext(AppContext);

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
      {/* Dashboard Summary Hero Banner Matching Screenshot */}
      <div className="dashboard-hero">
        <h1>Dashboard Summary</h1>
        <p>BCA Semester 5 Student Attendance Management Project</p>
      </div>

      {/* 3 Stats Cards Row */}
      <div className="stats-grid-dashboard">
        <div className="report-card blue-border">
          <span>TOTAL STUDENTS</span>
          <h2>{totalStudents}</h2>
        </div>
        <div className="report-card green-border">
          <span>PRESENT STUDENTS (TODAY)</span>
          <h2 style={{ color: "#10b981" }}>{presentToday}</h2>
        </div>
        <div className="report-card red-border">
          <span>ABSENT STUDENTS (TODAY)</span>
          <h2 style={{ color: "#ef4444" }}>{absentToday}</h2>
        </div>
      </div>

      {/* Operations Directory section */}
      <h3 className="operations-section-title">Operations Directory</h3>

      <div className="operations-grid">
        <div className="operation-card">
          <h3>Manage Students</h3>
          <p>Add new student names, delete student records, and view lists.</p>
          <button className="btn-op btn-op-outline" onClick={() => setCurrentPage("students")}>
            Go to Students
          </button>
        </div>

        <div className="operation-card">
          <h3>Daily Attendance</h3>
          <p>Mark attendance sheets (Present / Absent toggles) for any selected date.</p>
          <button className="btn-op btn-op-filled" onClick={() => setCurrentPage("attendance")}>
            Mark Attendance
          </button>
        </div>

        <div className="operation-card">
          <h3>Reports & Summary</h3>
          <p>View complete attendance ratios, tables, and total summary cards.</p>
          <button className="btn-op btn-op-outline" onClick={() => setCurrentPage("reports")}>
            Go to Reports
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
