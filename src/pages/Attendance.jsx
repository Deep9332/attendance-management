import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Attendance() {
  const { user, students, attendance, saveAttendance, setCurrentPage } = useContext(AppContext);
  const isAdmin = user?.role === "admin";

  // Get today's date as default YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  
  // Local temporary state to store record changes before saving
  const [tempRecords, setTempRecords] = useState({});

  // When selectedDate changes, load existing records from the database
  useEffect(() => {
    const existingRecords = attendance[selectedDate] || {};
    setTempRecords(existingRecords);
  }, [selectedDate, attendance]);

  // Handle present/absent button clicks locally
  const markStatus = (studentId, status) => {
    if (!isAdmin) return;
    setTempRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Save local changes to context and localStorage
  const handleSave = () => {
    if (!isAdmin) return;
    saveAttendance(selectedDate, tempRecords);
    alert(`Attendance for ${selectedDate} saved successfully!`);
  };

  // Bulk Actions
  const markAllPresent = () => {
    if (!isAdmin) return;
    const updated = {};
    students.forEach((student) => {
      updated[student.id] = "Present";
    });
    setTempRecords(updated);
  };

  const markAllAbsent = () => {
    if (!isAdmin) return;
    const updated = {};
    students.forEach((student) => {
      updated[student.id] = "Absent";
    });
    setTempRecords(updated);
  };

  return (
    <div className="attendance-container">
      {/* Title Header with Shortcut */}
      <div className="section-header-flex">
        <div>
          <h2>{isAdmin ? "Mark Daily Attendance" : "View Attendance Records"}</h2>
        </div>
        <button className="btn btn-outline" onClick={() => setCurrentPage("dashboard")}>
          &larr; Dashboard
        </button>
      </div>

      {/* Read-Only Banner for User */}
      {!isAdmin && (
        <div className="read-only-banner">
          🔒 <strong>User Panel Notice:</strong> You are viewing attendance records for the selected date. Marking or saving attendance is disabled in User Panel.
        </div>
      )}

      {/* Date Selector & Bulk Actions Row */}
      <div className="attendance-controls-row">
        <div className="date-selector-wrapper">
          <label htmlFor="attendance-date" style={{ fontWeight: "700", marginRight: "10px", color: "var(--neutral-dark)" }}>
            Select Date:
          </label>
          <input
            id="attendance-date"
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div className="bulk-actions-wrapper">
            <button className="btn btn-outline btn-sm btn-bulk-present" onClick={markAllPresent}>
              ✔️ Mark All Present
            </button>
            <button className="btn btn-outline btn-sm btn-bulk-absent" onClick={markAllAbsent}>
              ❌ Mark All Absent
            </button>
          </div>
        )}
      </div>

      {/* Attendance Sheet Table */}
      <div className="table-responsive" style={{ marginTop: "20px" }}>
        <table className="custom-table text-center">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>S.NO</th>
              <th style={{ width: "150px" }}>ROLL NUMBER</th>
              <th>STUDENT NAME</th>
              {isAdmin && <th style={{ width: "200px" }}>ACTION</th>}
              <th style={{ width: "200px" }}>ATTENDANCE STATUS</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const currentStatus = tempRecords[student.id] || "NOT MARKED";
              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: "700", color: "var(--primary-dark)" }}>
                    {student.rollNo}
                  </td>
                  <td style={{ textAlign: "left", paddingLeft: "40px" }}>
                    {student.name}
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="action-button-group">
                        <button
                          className={`btn-action present ${
                            currentStatus === "Present" ? "active" : ""
                          }`}
                          onClick={() => markStatus(student.id, "Present")}
                        >
                          Present
                        </button>
                        <button
                          className={`btn-action absent ${
                            currentStatus === "Absent" ? "active" : ""
                          }`}
                          onClick={() => markStatus(student.id, "Absent")}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  )}
                  <td>
                    <span className={`status-badge-flat ${currentStatus.replace(" ", "-").toLowerCase()}`}>
                      {currentStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="no-data">
                  {isAdmin
                    ? "No students added. Go to the Students page to add students."
                    : "No student attendance records available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Save Button Row (Admin Only) */}
      {isAdmin && students.length > 0 && (
        <div className="save-button-row">
          <button className="btn btn-save" onClick={handleSave}>
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
}

export default Attendance;
