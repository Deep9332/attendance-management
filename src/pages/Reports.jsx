import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Reports() {
  const { students, attendance, setCurrentPage } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overall"); // "overall" or "date"

  // Date picker state for the "Filter by Date" tab
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [filterDate, setFilterDate] = useState(getTodayDateString());

  // Get total list of dates marked in system
  const allDates = Object.keys(attendance);
  const classesConducted = allDates.length;

  // Calculate Average Absentees
  let totalAbsentees = 0;
  allDates.forEach((date) => {
    const dayRecord = attendance[date] || {};
    const absents = Object.values(dayRecord).filter((status) => status === "Absent").length;
    totalAbsentees += absents;
  });
  const avgAbsentees = classesConducted > 0 ? Math.round(totalAbsentees / classesConducted) : 0;

  // Calculate Overall Attendance Rate
  let totalPresentCount = 0;
  let totalMarkedCount = 0;

  Object.values(attendance).forEach((dayRecords) => {
    Object.values(dayRecords).forEach((status) => {
      if (status === "Present" || status === "Absent") {
        totalMarkedCount++;
        if (status === "Present") {
          totalPresentCount++;
        }
      }
    });
  });

  const overallRate = totalMarkedCount > 0 ? Math.round((totalPresentCount / totalMarkedCount) * 100) : 0;

  // Calculate stats per student for all time
  const studentsStats = students.map((student) => {
    let presentCount = 0;
    let absentCount = 0;

    allDates.forEach((date) => {
      const dayRecord = attendance[date];
      if (dayRecord && dayRecord[student.id]) {
        if (dayRecord[student.id] === "Present") {
          presentCount++;
        } else if (dayRecord[student.id] === "Absent") {
          absentCount++;
        }
      }
    });

    // In a school tracker, the total classes for a student is the number of sessions they were marked
    const studentTotalClasses = classesConducted; // matching screenshot where total classes is same for all
    const rate = studentTotalClasses > 0 ? Math.round((presentCount / studentTotalClasses) * 100) : 0;

    return {
      ...student,
      presentCount,
      absentCount,
      rate,
      totalClasses: studentTotalClasses,
    };
  });

  // Calculate Rate color for styling
  const getRateColor = (rate) => {
    if (rate === 100) return "#10b981"; // Vibrant Green
    if (rate >= 60) return "#d97706"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <div className="reports-container">
      {/* Title Header with Dashboard Shortcut */}
      <div className="section-header-flex">
        <div>
          <h2>Attendance Reports</h2>
        </div>
        <button className="btn btn-outline" onClick={() => setCurrentPage("dashboard")}>
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Tabs Switcher Matching Screenshot */}
      <div className="reports-tabs">
        <button
          className={`tab-btn ${activeTab === "overall" ? "active" : ""}`}
          onClick={() => setActiveTab("overall")}
        >
          Overall Performance (All Time)
        </button>
        <button
          className={`tab-btn ${activeTab === "date" ? "active" : ""}`}
          onClick={() => setActiveTab("date")}
        >
          Filter by Date
        </button>
      </div>

      {/* VIEW 1: Overall Performance Tab */}
      {activeTab === "overall" && (
        <>
          {/* Statistics Cards Row */}
          <div className="stats-grid-reports">
            <div className="report-card blue-border">
              <span>TOTAL STUDENTS</span>
              <h2>{students.length}</h2>
            </div>
            <div className="report-card green-border">
              <span>CLASSES CONDUCTED</span>
              <h2>{classesConducted}</h2>
            </div>
            <div className="report-card red-border">
              <span>AVG. ABSENTEES</span>
              <h2>{avgAbsentees}</h2>
            </div>
            <div className="report-card orange-border">
              <span>OVERALL RATE</span>
              <h2>{overallRate}%</h2>
            </div>
          </div>

          <h3 className="table-section-title">All-Time Performance Summary</h3>

          {/* Overall Table */}
          <div className="table-responsive">
            <table className="custom-table text-center">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>S.NO</th>
                  <th style={{ width: "150px" }}>ROLL NUMBER</th>
                  <th>STUDENT NAME</th>
                  <th>TOTAL CLASSES</th>
                  <th>DAYS PRESENT</th>
                  <th>DAYS ABSENT</th>
                  <th>ATTENDANCE RATE</th>
                </tr>
              </thead>
              <tbody>
                {studentsStats.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: "700" }}>{student.rollNo}</td>
                    <td style={{ fontWeight: "500", textAlign: "left", paddingLeft: "40px" }}>
                      {student.name}
                    </td>
                    <td>{student.totalClasses}</td>
                    <td style={{ color: "#10b981", fontWeight: "700" }}>{student.presentCount}</td>
                    <td style={{ color: "#ef4444", fontWeight: "700" }}>{student.absentCount}</td>
                    <td style={{ fontWeight: "700", color: getRateColor(student.rate) }}>
                      {student.rate}%
                    </td>
                  </tr>
                ))}
                {studentsStats.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No student records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW 2: Filter by Date Tab */}
      {activeTab === "date" && (
        <>
          {/* Select Date Picker */}
          <div style={{ marginBottom: "20px" }}>
            <div className="date-selector-wrapper">
              <label htmlFor="filter-report-date" style={{ fontWeight: "700", marginRight: "10px" }}>
                Select Date:
              </label>
              <input
                id="filter-report-date"
                type="date"
                className="date-input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          <h3 className="table-section-title">Attendance Records for {filterDate}</h3>

          {/* Date-Specific Table */}
          <div className="table-responsive">
            <table className="custom-table text-center">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>S.NO</th>
                  <th style={{ width: "150px" }}>ROLL NUMBER</th>
                  <th>STUDENT NAME</th>
                  <th style={{ width: "250px" }}>ATTENDANCE STATUS</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const dayRecord = attendance[filterDate] || {};
                  const status = dayRecord[student.id] || "NOT MARKED";
                  return (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: "700" }}>{student.rollNo}</td>
                      <td style={{ fontWeight: "500", textAlign: "left", paddingLeft: "40px" }}>
                        {student.name}
                      </td>
                      <td>
                        <span className={`status-badge-flat ${status.replace(" ", "-").toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No student records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
