import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Students() {
  const { user, students, addStudent, updateStudent, deleteStudent, setCurrentPage } = useContext(AppContext);
  const isAdmin = user?.role === "admin";

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  // State for inline edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRollNo, setEditRollNo] = useState("");

  // useRef to focus the Roll Number input field on mount for admin
  const rollRef = useRef(null);

  useEffect(() => {
    if (isAdmin && rollRef.current) {
      rollRef.current.focus();
    }
  }, [isAdmin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
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

    if (rollRef.current) {
      rollRef.current.focus();
    }
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditRollNo(student.rollNo);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditRollNo("");
  };

  const handleSaveEdit = (id) => {
    if (editName.trim() === "" || editRollNo.trim() === "") {
      alert("Name and Roll Number cannot be empty!");
      return;
    }

    // Check duplicate roll number excluding current student
    const duplicate = students.find((s) => s.id !== id && s.rollNo === editRollNo.trim());
    if (duplicate) {
      alert(`Roll Number ${editRollNo} already exists for ${duplicate.name}!`);
      return;
    }

    updateStudent(id, editName.trim(), editRollNo.trim());
    setEditingId(null);
  };

  return (
    <div className="students-container">
      <div className="section-header-flex">
        <div>
          <h2>👨‍🎓 Student Directory {isAdmin ? "(Admin Access)" : "(Read-Only)"}</h2>
          <p className="section-subtitle">
            {isAdmin
              ? "Add, edit, update, or remove student records"
              : "View the list of enrolled students"}
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => setCurrentPage("dashboard")}>
          &larr; Dashboard
        </button>
      </div>

      {/* Notice for User Role */}
      {!isAdmin && (
        <div className="read-only-banner">
          🔒 <strong>User Panel Notice:</strong> You are in read-only mode. Adding, editing, and deleting student records is disabled.
        </div>
      )}

      {/* Add Student Form (Admin Only) */}
      {isAdmin && (
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
      )}

      {/* Students Directory Table */}
      <div className="table-responsive">
        <table className="custom-table text-center">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>S.No.</th>
              <th style={{ width: "160px" }}>Roll Number</th>
              <th>Student Name</th>
              {isAdmin ? (
                <th style={{ width: "200px" }}>Actions</th>
              ) : (
                <th style={{ width: "120px" }}>Access</th>
              )}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const isEditing = editingId === student.id;

              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: "700" }}>
                    {isEditing ? (
                      <input
                        type="text"
                        className="table-input"
                        value={editRollNo}
                        onChange={(e) => setEditRollNo(e.target.value)}
                      />
                    ) : (
                      student.rollNo
                    )}
                  </td>
                  <td style={{ fontWeight: "500", textAlign: "left", paddingLeft: "40px" }}>
                    {isEditing ? (
                      <input
                        type="text"
                        className="table-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td>
                    {isAdmin ? (
                      isEditing ? (
                        <div className="table-action-buttons">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleSaveEdit(student.id)}
                          >
                            💾 Save
                          </button>
                          <button className="btn btn-outline btn-sm" onClick={cancelEdit}>
                            ✖️ Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="table-action-buttons">
                          <button
                            className="btn btn-edit btn-sm"
                            onClick={() => startEdit(student)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteStudent(student.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="read-only-pill">Read Only</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 4 : 4} className="no-data">
                  {isAdmin
                    ? "No students in the directory yet. Add one above!"
                    : "No students available in directory."}
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
