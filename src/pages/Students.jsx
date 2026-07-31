import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Students() {
  // Consume context state
  const { students, addStudent, deleteStudent, setCurrentPage } = useContext(AppContext);

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  // useRef to focus the Roll Number input field on mount
  const rollRef = useRef(null);

  useEffect(() => {
    if (rollRef.current) {
      rollRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "" || rollNo.trim() === "") return;
    
    // Check for duplicate Roll Number
    const duplicate = students.find((s) => s.rollNo === rollNo.trim());
    if (duplicate) {
      alert(`Roll Number ${rollNo} already exists for ${duplicate.name}!`);
      return;
    }

    addStudent(name.trim(), rollNo.trim());
    setName("");
    setRollNo("");

    // Refocus the roll input box
    if (rollRef.current) {
      rollRef.current.focus();
    }
  };

  return (
    <div className="students-container">
      <div className="section-header-flex">
        <div>
          <h2>👨‍🎓 Student Directory</h2>
          <p className="section-subtitle">Manage your classroom database</p>
        </div>
        <button className="btn btn-outline" onClick={() => setCurrentPage("dashboard")}>
          &larr; Dashboard
        </button>
      </div>

      {/* Add Student Form */}
      <form onSubmit={handleSubmit} className="add-student-form">
        <div style={{ display: "flex", gap: "1rem", width: "100%", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Roll Number (e.g. 106)"
            ref={rollRef}
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            style={{ flex: "1", minWidth: "150px" }}
            required
          />
          <input
            type="text"
            placeholder="Student's Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: "2", minWidth: "250px" }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ minWidth: "150px" }}>
            ➕ Add Student
          </button>
        </div>
      </form>

      {/* Students Directory Table */}
      <div className="table-responsive">
        <table className="custom-table text-center">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>S.No.</th>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th style={{ width: "150px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: "700" }}>{student.rollNo}</td>
                <td style={{ fontWeight: "500", textAlign: "left", paddingLeft: "40px" }}>
                  {student.name}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStudent(student.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  No students in the directory yet. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;
