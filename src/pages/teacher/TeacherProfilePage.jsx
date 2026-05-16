// src/pages/teacher/TeacherProfilePage.jsx
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Card, SectionLabel, Avatar } from "../../components/ui";
import { Icon } from "../../components/Icons";

export default function TeacherProfilePage() {
  const { currentUser, students, shopItems, getStudentTransactions, logout } =
    useApp();
  const navigate = useNavigate();

  const totalTxs = students.reduce(
    (a, s) => a + getStudentTransactions(s._id).length,
    0,
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSettingsClick = (label) => {
    if (label === "Account Settings") {
      navigate("/account-settings");
    } else if (label === "Notifications") {
      navigate("/notifications");
    }
  };

  const SETTINGS = [
    { icon: "settings", label: "Account Settings" },
    { icon: "bank", label: "Class Management" },
  ];

  return (
    <div className="space-y-4 mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl">
      {/* Profile */}
      <Card className="p-6 text-center dark:bg-slate-800/95 dark:border dark:border-slate-700 dark:shadow-lg dark:shadow-slate-950/20">
        <div className="flex justify-center mb-3">
          <Avatar user={currentUser} size={80} />
        </div>
        <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl">
          {currentUser.name}
        </h2>
      </Card>

      {/* Stats */}
      <div className="gap-2 grid grid-cols-3">
        {[
          { label: "Students", value: students.length, icon: "users" },
          { label: "Transactions", value: totalTxs, icon: "coins" },
          { label: "Shop Items", value: shopItems.length, icon: "shop" },
        ].map((s) => (
          <Card
            key={s.label}
            className="p-3 text-center dark:bg-slate-800/95 dark:border dark:border-slate-700 dark:shadow-lg dark:shadow-slate-950/20"
          >
            <div className="flex justify-center text-slate-400 dark:text-slate-500 mb-1">
              <Icon name={s.icon} size={20} />
            </div>
            <p className="font-poppins font-black text-slate-800 dark:text-white text-xl">
              {s.value}
            </p>
            <p className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {s.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card className="p-4 dark:bg-slate-800/95 dark:border dark:border-slate-700 dark:shadow-lg dark:shadow-slate-950/20">
        <SectionLabel>Settings</SectionLabel>
        <div className="mt-2 space-y-1">
          {SETTINGS.map((s) => (
            <div
              key={s.label}
              onClick={() => handleSettingsClick(s.label)}
              className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-slate-500 dark:text-slate-400">
                  <Icon name={s.icon} size={18} />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                  {s.label}
                </span>
              </div>
              <Icon
                name="chevronRight"
                size={12}
                className="text-slate-300 dark:text-slate-600"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 mt-4 py-3 border-none rounded-xl w-full font-black text-red-500 dark:text-red-400 text-sm transition-all cursor-pointer"
        >
          <Icon name="logout" size={16} /> Log Out
        </button>
      </Card>
    </div>
  );
}
