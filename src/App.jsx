                                                                                                                                                                                                                      // src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { RequireStudent, RequireTeacher } from "./components/ProtectedRoute";
import { Toast } from "./components/ui";
import DarkModeToggle from "./components/DarkModeToggle";

// Pages
import LoginPage                  from "./pages/LoginPage";
import AccountSettingsPage        from "./pages/AccountSettingsPage";
import NotificationsPage          from "./pages/NotificationsPage";
import HelpSupportPage            from "./pages/HelpSupportPage";
import TermsPage                  from "./pages/TermsPage";
import PrivacyPage                from "./pages/PrivacyPage";
import ChatPage                   from "./pages/ChatPage";
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
import TeacherClassesPage         from "./pages/teacher/TeacherClassesPage";
import TeacherAnalyticsPage       from "./pages/teacher/TeacherAnalyticsPage";

export default function App() {
return (
    <AppProvider>
      <Toast />
      <DarkModeToggle />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<LoginPage />} />


          <Route path="/account-settings" element={<AccountSettingsPage />} />
          {/* Student */}
          {/* Notifications - accessible to all */}
          <Route path="/notifications" element={<NotificationsPage />} />

{/* Legal Pages - accessible to all */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

{/* Chat - accessible to all */}
          <Route path="/chat" element={
            <RequireStudent><ChatPage /></RequireStudent>
          } />
          <Route path="/teacher/chat" element={
            <RequireTeacher><ChatPage /></RequireTeacher>
          } />
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
            <Route path="help"         element={<HelpSupportPage       />} />
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
            <Route path="classes"          element={<TeacherClassesPage       />} />
            <Route path="quizzes"          element={<TeacherQuizzesPage       />} />
            <Route path="quizzes/:id"      element={<TeacherQuizResultsPage   />} />
            <Route path="students/:id"     element={<TeacherStudentDetailPage />} />
            <Route path="shop"             element={<TeacherShopPage          />} />
            <Route path="analytics"       element={<TeacherAnalyticsPage    />} />
            <Route path="profile"          element={<TeacherProfilePage       />} />
            <Route path="help"             element={<HelpSupportPage        />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

