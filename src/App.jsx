// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { RequireStudent, RequireTeacher } from "./components/ProtectedRoute";
import { Toast } from "./components/ui";

// Pages
import LoginPage                  from "./pages/LoginPage";
import StudentLayout              from "./pages/student/StudentLayout";
import StudentHomePage            from "./pages/student/StudentHomePage";
import StudentWalletPage            from "./pages/student/StudentWalletPage";
import StudentRewardsPage           from "./pages/student/StudentRewardsPage";
import StudentLeaderboardPage      from "./pages/student/StudentLeaderboardPage";
import StudentProfilePage          from "./pages/student/StudentProfilePage";
import StudentTestsPage           from "./pages/student/StudentTestsPage";
import StudentQuizPage            from "./pages/student/StudentQuizPage";
import TeacherLayout              from "./pages/teacher/TeacherLayout";
import TeacherStudentsPage        from "./pages/teacher/TeacherStudentsPage";
import TeacherStudentDetailPage   from "./pages/teacher/TeacherStudentDetailPage";
import TeacherShopPage            from "./pages/teacher/TeacherShopPage";
import TeacherProfilePage         from "./pages/teacher/TeacherProfilePage";
import TeacherQuizzesPage         from "./pages/teacher/TeacherQuizzesPage";
import TeacherQuizResultsPage     from "./pages/teacher/TeacherQuizResultsPage";

export default function App() {
  return (
    <AppProvider>
      <Toast />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<LoginPage />} />

          {/* Student */}
          <Route path="/student" element={
            <RequireStudent><StudentLayout /></RequireStudent>
          }>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home"         element={<StudentHomePage        />} />
            <Route path="wallet"       element={<StudentWalletPage      />} />
            <Route path="rewards"      element={<StudentRewardsPage     />} />
            <Route path="leaderboard"   element={<StudentLeaderboardPage />} />
            <Route path="tests"        element={<StudentTestsPage       />} />
            <Route path="profile"      element={<StudentProfilePage     />} />
          </Route>

          {/* Quiz — layout SIZ (full screen) */}
          <Route path="/student/quiz/:id" element={
            <RequireStudent><StudentQuizPage /></RequireStudent>
          } />

          {/* Teacher */}
          <Route path="/teacher" element={
            <RequireTeacher><TeacherLayout /></RequireTeacher>
          }>
            <Route index element={<Navigate to="students" replace />} />
            <Route path="students"         element={<TeacherStudentsPage      />} />
            <Route path="quizzes"          element={<TeacherQuizzesPage       />} />
            <Route path="quizzes/:id"      element={<TeacherQuizResultsPage   />} />
            <Route path="students/:id"     element={<TeacherStudentDetailPage />} />
            <Route path="shop"             element={<TeacherShopPage          />} />
            <Route path="profile"          element={<TeacherProfilePage       />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}