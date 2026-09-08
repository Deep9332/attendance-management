import { createContext, useReducer, useState, useEffect } from "react";

// 1. Create Context
export const AppContext = createContext();

// Default student list
const defaultStudents = [
  { id: 1, name: "Deep Prajapati", rollNo: "101" },
];

// 2. Reducer for Students Directory
const studentReducer = (state, action) => {
  switch (action.type) {
    case "ADD_STUDENT":
      return [...state, action.payload];
    case "UPDATE_STUDENT":
      return state.map((student) =>
        student.id === action.payload.id
          ? { ...student, name: action.payload.name, rollNo: action.payload.rollNo }
          : student
      );
    case "DELETE_STUDENT":
      return state.filter((student) => student.id !== action.payload);
    default:
      return state;
  }
};

// 3. Provider Component
export const AppProvider = ({ children }) => {
  // Page Navigation State
  const [currentPage, setCurrentPage] = useState("login");

  // User State: stores object { username, role } or null
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("attendance_user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed === "object" && parsed !== null && parsed.role) {
        return parsed;
      }
      return { username: saved, role: "admin" };
    } catch {
      return { username: saved, role: "admin" };
    }
  });

  // Students list using useReducer with automatic migration for legacy records
  const [students, dispatchStudents] = useReducer(studentReducer, [], () => {
    const saved = localStorage.getItem("attendance_students");
    let parsed = saved ? JSON.parse(saved) : defaultStudents;

    // Force-reset if it contains the old list names we want to clean up
    const oldNames = [
      "Rahul Sharma", "Priya Patel", "Amit Verma", "Sneha Reddy", "Vikram Singh",
      "Harsh Prajapati", "Jay solanki", "Alok kanojiya", "Rushi Sable"
    ];
    if (parsed.some((s) => oldNames.includes(s.name))) {
      parsed = defaultStudents;
      localStorage.setItem("attendance_students", JSON.stringify(defaultStudents));
      localStorage.removeItem("attendance_db"); // Clear old date records too
    }

    let needsMigration = false;
    const migrated = parsed.map((student, idx) => {
      const updated = { ...student };
      // Ensure unique numeric id
      if (!updated.id) {
        updated.id = Date.now() + idx;
        needsMigration = true;
      }
      // Ensure unique roll number
      if (!updated.rollNo) {
        updated.rollNo = String(101 + idx);
        needsMigration = true;
      }
      return updated;
    });

    if (needsMigration) {
      localStorage.setItem("attendance_students", JSON.stringify(migrated));
    }
    return migrated;
  });

  // Attendance Database using useState (maps date -> { studentId: "Present" / "Absent" })
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem("attendance_db");
    return saved ? JSON.parse(saved) : {};
  });

  // Sync Students state with localStorage
  useEffect(() => {
    localStorage.setItem("attendance_students", JSON.stringify(students));
  }, [students]);

  // Sync Attendance database with localStorage
  useEffect(() => {
    localStorage.setItem("attendance_db", JSON.stringify(attendance));
  }, [attendance]);

  // Sync User state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("attendance_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("attendance_user");
    }
  }, [user]);

  // Actions
  const login = (username, role = "admin") => {
    setUser({ username, role });
    setCurrentPage("dashboard");
  };

  const logout = () => {
    setUser(null);
  };

  const addStudent = (name, rollNo) => {
    dispatchStudents({
      type: "ADD_STUDENT",
      payload: {
        id: Date.now(),
        name,
        rollNo,
      },
    });
  };

  const updateStudent = (id, name, rollNo) => {
    dispatchStudents({
      type: "UPDATE_STUDENT",
      payload: { id, name, rollNo },
    });
  };

  const deleteStudent = (id) => {
    dispatchStudents({ type: "DELETE_STUDENT", payload: id });
  };

  const saveAttendance = (date, records) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: records,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentPage,
        setCurrentPage,
        students,
        attendance,
        login,
        logout,
        addStudent,
        updateStudent,
        deleteStudent,
        saveAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
