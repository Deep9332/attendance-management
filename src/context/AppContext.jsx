import { createContext, useReducer, useState, useEffect } from "react";

// 1. Create Context
export const AppContext = createContext();

// Default student list matching the screenshot
const defaultStudents = [
  { id: 1, name: "Deep Prajapati", rollNo: "101" },
  { id: 2, name: "Harsh Prajapati", rollNo: "102" },
  { id: 3, name: "Jay solanki", rollNo: "103" },
  { id: 4, name: "Alok kanojiya", rollNo: "104" },
  { id: 5, name: "Rushi Sable", rollNo: "105" },
];

// 2. Reducer for Students Directory
const studentReducer = (state, action) => {
  switch (action.type) {
    case "ADD_STUDENT":
      return [...state, action.payload];
    case "DELETE_STUDENT":
      return state.filter((student) => student.id !== action.payload);
    default:
      return state;
  }
};

// 3. Provider Component
export const AppProvider = ({ children }) => {
  // Page Navigation State
  const [currentPage, setCurrentPage] = useState("dashboard");

  // User State
  const [user, setUser] = useState(() => {
    return localStorage.getItem("attendance_user") || null;
  });

  // Students list using useReducer with automatic migration for legacy records
  const [students, dispatchStudents] = useReducer(studentReducer, [], () => {
    const saved = localStorage.getItem("attendance_students");
    const parsed = saved ? JSON.parse(saved) : defaultStudents;

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
      localStorage.setItem("attendance_user", user);
    } else {
      localStorage.removeItem("attendance_user");
    }
  }, [user]);

  // Actions
  const login = (username) => {
    setUser(username);
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
        deleteStudent,
        saveAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
