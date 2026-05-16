import { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { SectionLabel } from "../../components/ui";
import { Icon } from "../../components/Icons";
import {
  FaClock,
  FaCheck,
  FaBell,
  FaCalendarAlt,
  FaSchool,
} from "react-icons/fa";

const DAYS = [
  { value: "monday", label: "Dushanba" },
  { value: "tuesday", label: "Seshanba" },
  { value: "wednesday", label: "Chorshanba" },
  { value: "thursday", label: "Payshanba" },
  { value: "friday", label: "Juma" },
  { value: "saturday", label: "Shanba" },
  { value: "sunday", label: "Yakshanba" },
];

export default function TeacherSchedulePage() {
  const { classes, getScheduleForClass, updateScheduleForClass, showToast } =
    useApp();
  const [selectedClass, setSelectedClass] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    enabled: false,
    days: [],
    time: "09:00",
    notifyBefore8Hours: true,
    notifyBefore10Minutes: true,
  });

  const loadSchedule = useCallback(
    async (classId) => {
      setLoading(true);
      try {
        const data = await getScheduleForClass(classId);
        if (data) {
          setSchedule(data);
          setForm({
            enabled: data.enabled || false,
            days: data.days || [],
            time: data.time || "09:00",
            notifyBefore8Hours: data.notifyBefore8Hours !== false,
            notifyBefore10Minutes: data.notifyBefore10Minutes !== false,
          });
        }
      } catch (err) {
        showToast(`❌ ${err.message || "Failed to load schedule"}`, "error");
      } finally {
        setLoading(false);
      }
    },
    [getScheduleForClass, showToast],
  );

  const selectedClassId = selectedClass?._id;

  useEffect(() => {
    if (selectedClassId) {
      loadSchedule(selectedClassId);
    }
  }, [loadSchedule, selectedClassId]);

  const handleSave = async () => {
    if (!selectedClass) return;

    if (form.enabled && form.days.length === 0) {
      showToast("❌ Select at least one day", "error");
      return;
    }

    setSaving(true);
    try {
      const result = await updateScheduleForClass(selectedClass._id, form);
      if (result.ok) {
        showToast("✅ Schedule saved!");
        setSchedule(result.schedule);
      } else {
        showToast(`❌ ${result.message || "Failed to save schedule"}`, "error");
      }
    } catch (err) {
      showToast(`❌ ${err.message || "Failed to save schedule"}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  return (
    <div className="space-y-5 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">
      {/* Header */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
        <div>
          <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">
            Teacher Dashboard
          </p>
          <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl md:text-3xl">
            Dars Jadvali
          </h2>
          <p className="mt-1 text-slate-400 dark:text-slate-500 text-xs">
            O'quvchilarga dars kunlari haqida Telegram orqali xabar yuboring
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl">
            <FaBell className="text-blue-500 text-lg" />
          </div>
          <div>
            <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm">
              Avtomatik xabarlar
            </h4>
            <p className="mt-1 text-blue-600 dark:text-blue-300 text-xs">
              Dars boshlanishidan <strong>8 soat oldin</strong> va{" "}
              <strong>10 daqiqa oldin</strong> o'quvchilaringizga Telegram
              orqali xabar keladi. Faqatgina Telegramga ulangan o'quvchilar
              xabar oladi.
            </p>
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div>
        <SectionLabel>Sinfni tanlang</SectionLabel>
        <div className="gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => setSelectedClass(cls)}
              className={`p-4 rounded-2xl text-left transition-all shadow-sm hover:shadow-md ${
                selectedClass?._id === cls._id
                  ? "bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500"
                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaSchool
                  className={
                    selectedClass?._id === cls._id
                      ? "text-brand-500"
                      : "text-slate-400 dark:text-slate-500"
                  }
                />
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {cls.name}
                </span>
              </div>
              <p className="mt-1 text-slate-400 dark:text-slate-500 text-xs">
                {cls.studentCount || 0} o'quvchi
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Settings */}
      {selectedClass && !loading && (
        <div className="bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white text-lg">
              <FaCalendarAlt className="text-brand-500" /> {selectedClass.name}{" "}
              - Jadval
            </h3>
            {schedule?.enabled && (
              <span className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-bold text-green-600 dark:text-green-400 text-xs">
                <FaCheck className="inline mr-1" /> Active
              </span>
            )}
          </div>

          {/* Enable Toggle */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 mb-5 p-4 rounded-xl">
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-200">
                Xabarlarni yoqish
              </p>
              <p className="text-slate-500 text-xs">
                O'quvchilarga avtomatik xabar yuboriladi
              </p>
            </div>
            <button
              onClick={() =>
                setForm((prev) => ({ ...prev, enabled: !prev.enabled }))
              }
              className={`w-14 h-8 rounded-full transition-all ${
                form.enabled ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  form.enabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Time Selection */}
          <div className="mb-5">
            <label className="block mb-2 font-bold text-slate-700 dark:text-slate-200 text-sm">
              <FaClock className="inline mr-2" /> Dars vaqti
            </label>
            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, time: e.target.value }))
              }
              disabled={!form.enabled}
              className="bg-slate-50 dark:bg-slate-700 disabled:opacity-50 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
            />
          </div>

          {/* Days Selection */}
          <div className="mb-5">
            <label className="block mb-2 font-bold text-slate-700 dark:text-slate-200 text-sm">
              Dars kunlari
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => form.enabled && toggleDay(day.value)}
                  disabled={!form.enabled}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    form.days.includes(day.value)
                      ? "bg-brand-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  } ${!form.enabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Options */}
          <div className="space-y-3 mb-5">
            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
              Xabar variantlari
            </p>

            <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyBefore8Hours}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notifyBefore8Hours: e.target.checked,
                  }))
                }
                disabled={!form.enabled}
                className="rounded focus:ring-brand-500 w-5 h-5 text-brand-500"
              />
              <span className="text-slate-700 dark:text-slate-200 text-sm">
                <strong>8 soat oldin</strong> xabar yuborish
              </span>
            </label>

            <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyBefore10Minutes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notifyBefore10Minutes: e.target.checked,
                  }))
                }
                disabled={!form.enabled}
                className="rounded focus:ring-brand-500 w-5 h-5 text-brand-500"
              />
              <span className="text-slate-700 dark:text-slate-200 text-sm">
                <strong>10 daqiqa oldin</strong> xabar yuborish
              </span>
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !form.enabled}
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 py-4 rounded-xl w-full font-extrabold text-white text-sm transition-all disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? (
              "Saqlanmoqda..."
            ) : (
              <>
                <Icon name="save" size={16} /> Saqlash
              </>
            )}
          </button>
        </div>
      )}

      {/* No Class Selected */}
      {!selectedClass && classes.length > 0 && (
        <div className="py-16 text-center">
          <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-700 mx-auto mb-4 rounded-full w-20 h-20">
            <FaCalendarAlt className="text-slate-400 text-3xl" />
          </div>
          <p className="font-bold dark:text-white text-lg">Sinfni tanlang</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Yuqoridagi sinflardan birini bosing
          </p>
        </div>
      )}

      {/* No Classes */}
      {classes.length === 0 && (
        <div className="py-16 text-center">
          <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-700 mx-auto mb-4 rounded-full w-20 h-20">
            <FaSchool className="text-slate-400 text-3xl" />
          </div>
          <p className="font-bold dark:text-white text-lg">Sinflar yo'q</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Avval sinf yarating
          </p>
        </div>
      )}
    </div>
  );
}
