import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Modal, SectionLabel } from "../../components/ui";
import { FaPlus, FaUsers, FaEdit, FaTrash, FaCheck, FaTimes, FaSchool, FaSearch, FaSortAmountDown, FaArrowUp, FaArrowDown, FaUserGraduate, FaClock } from "react-icons/fa";

const BLANK = { name: "", description: "" };

export default function TeacherClassesPage() {
  const { classes, students, createClass, updateClass, deleteClass, showToast } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, name, students

  // Filter and sort classes
  const filteredClasses = useMemo(() => {
    let result = [...classes];
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
      );
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "students":
          return (b.studentCount || 0) - (a.studentCount || 0);
        case "date":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    return result;
  }, [classes, searchQuery, sortBy]);

  // Get students in a class
  const getClassStudents = (className) => {
    return students.filter(s => s.class === className).slice(0, 3);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.name.trim()) {
      showToast("❌ Class name is required", "error");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await updateClass(editingId, form);
        showToast("✅ Class updated!");
      } else {
        await createClass(form);
        showToast("✅ Class created!");
      }
      closeModal();
    } catch (err) {
      showToast("❌ " + (err.message || "Failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteClass(deleteId);
      showToast("✅ Class deleted!");
      closeDeleteModal();
    } catch (err) {
      showToast("❌ " + (err.message || "Failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (cls) => {
    setForm({ name: cls.name, description: cls.description || "" });
    setEditingId(cls._id);
    setShowModal(true);
  };

  const openAddModal = () => {
    setForm({ ...BLANK });
    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ ...BLANK });
    setEditingId(null);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const avgStudents = classes.length ? Math.round(totalStudents / classes.length) : 0;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-5 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">
      {/* Header */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
        <div>
          <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Teacher Dashboard</p>
          <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl md:text-3xl">My Classes</h2>
          <p className="mt-1 text-slate-400 dark:text-slate-500 text-xs">
            {classes.length} class{classes.length !== 1 ? 'es' : ''} • {totalStudents} student{totalStudents !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 shadow-brand-500/30 shadow-lg px-5 py-3 md:py-2.5 border-none rounded-full font-extrabold text-white text-sm active:scale-95 transition-all cursor-pointer"
        >
          <FaPlus /> <span className="md:hidden lg:inline">Add Class</span>
        </button>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex sm:flex-row flex-col gap-3">
        <div className="relative flex-1">
          <FaSearch className="top-1/2 left-4 absolute text-slate-400 text-sm -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-slate-800 py-3 md:py-2.5 pr-4 pl-11 border-2 border-slate-100 focus:border-brand-400 dark:border-slate-700 rounded-2xl md:rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-800 py-3 md:py-2.5 pr-10 pl-4 border-2 border-slate-100 focus:border-brand-400 dark:border-slate-700 rounded-2xl md:rounded-xl outline-none w-full sm:w-40 font-medium text-slate-800 dark:text-slate-200 text-sm transition-all appearance-none cursor-pointer"
          >
            <option value="date">Newest First</option>
            <option value="name">Alphabetical</option>
            <option value="students">Most Students</option>
          </select>
          <FaSortAmountDown className="top-1/2 right-4 absolute text-slate-400 text-sm -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-500/20 shadow-lg p-5 rounded-2xl text-white">
          <div className="flex justify-between items-center mb-2">
            <p className="opacity-80 font-bold text-xs uppercase tracking-wider">Classes</p>
            <FaSchool className="opacity-50 text-lg" />
          </div>
          <p className="font-poppins font-black text-4xl">{classes.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/20 shadow-lg p-5 rounded-2xl text-white">
          <div className="flex justify-between items-center mb-2">
            <p className="opacity-80 font-bold text-xs uppercase tracking-wider">Students</p>
            <FaUsers className="opacity-50 text-lg" />
          </div>
          <p className="font-poppins font-black text-4xl">{totalStudents}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-500/20 p-5 rounded-2xl text-white">
          <div className="flex justify-between items-center mb-2">
            <p className="opacity-80 font-bold text-xs uppercase tracking-wider">Avg/Class</p>
            <FaUserGraduate className="opacity-50 text-lg" />
          </div>
          <p className="font-poppins font-black text-4xl">{avgStudents}</p>
        </div>
        <div className="hidden lg:block bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20 shadow-lg p-5 rounded-2xl text-white">
          <div className="flex justify-between items-center mb-2">
            <p className="opacity-80 font-bold text-xs uppercase tracking-wider">This Month</p>
            <FaClock className="opacity-50 text-lg" />
          </div>
          <p className="font-poppins font-black text-4xl">
            {classes.filter(c => {
              const created = new Date(c.createdAt);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Classes List */}
      <div>
        <SectionLabel>
          {searchQuery ? `Search Results (${filteredClasses.length})` : "All Classes"}
        </SectionLabel>
        {filteredClasses.length === 0 ? (
          <div className="py-16 text-center">
            <div className="relative mb-4">
              <div className="flex justify-center items-center bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-200 dark:to-slate-800 mx-auto rounded-full w-24 h-24">
                <FaSchool className="text-slate-300 dark:text-slate-500 text-4xl" />
              </div>
              {searchQuery && (
                <div className="-top-1 -right-1 absolute flex justify-center items-center bg-red-500 rounded-full w-8 h-8">
                  <FaTimes className="text-white text-sm" />
                </div>
              )}
            </div>
            {searchQuery ? (
              <>
                <p className="font-bold dark:text-white text-lg">No classes found</p>
                <p className="mt-1 text-slate-400 dark:text-slate-500 text-sm">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="font-bold dark:text-white text-lg">No classes yet</p>
                <p className="mt-1 mb-4 text-slate-400 dark:text-slate-500 text-sm">Create your first class to get started</p>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 px-6 py-3 border-none rounded-full font-extrabold text-white text-sm transition-all cursor-pointer"
                >
                  <FaPlus /> Create First Class
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredClasses.map((cls) => {
              const classStudents = getClassStudents(cls.name);
              return (
                <div
                  key={cls._id}
                  className="group bg-white dark:bg-slate-800 hover:shadow-brand-500/10 hover:shadow-xl p-5 border-2 border-slate-100 hover:border-brand-300 dark:border-slate-700 dark:hover:border-brand-500 rounded-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2 min-w-0">
                      <h3 className="font-extrabold text-slate-800 dark:group-hover:text-brand-400 dark:text-white group-hover:text-brand-600 text-lg truncate transition-colors">
                        {cls.name}
                      </h3>
                      {cls.description && (
                        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{cls.description}</p>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 gap-1.5">
                      <button
                        onClick={() => navigate(`/teacher/students?class=${encodeURIComponent(cls.name)}`)}
                        className="bg-slate-100 hover:bg-brand-100 dark:bg-slate-700 dark:hover:bg-brand-900/30 p-2 rounded-xl transition-colors cursor-pointer"
                        title="View Students"
                      >
                        <FaUsers className="text-slate-500 dark:text-slate-400 text-sm" />
                      </button>
                      <button
                        onClick={() => openEditModal(cls)}
                        className="bg-slate-100 hover:bg-brand-100 dark:bg-slate-700 dark:hover:bg-brand-900/30 p-2 rounded-xl transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <FaEdit className="text-slate-500 dark:text-slate-400 text-sm" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(cls._id)}
                        className="bg-slate-100 hover:bg-red-100 dark:bg-slate-700 dark:hover:bg-red-900/30 p-2 rounded-xl transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash className="text-slate-500 hover:text-red-500 dark:text-slate-400 text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Student Preview */}
                  {classStudents.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex -space-x-2">
                        {classStudents.map((s, i) => (
                          <div
                            key={s._id}
                            className="flex justify-center items-center border-2 border-white dark:border-slate-800 rounded-full w-8 h-8 font-bold text-white text-xs"
                            style={{ background: s.color || '#22c55e', zIndex: 3 - i }}
                            title={s.name}
                          >
                            {s.name?.charAt(0) || '?'}
                          </div>
                        ))}
                        {(cls.studentCount || 0) > 3 && (
                          <div className="flex justify-center items-center bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 rounded-full w-8 h-8 font-bold text-slate-600 dark:text-slate-200 text-xs">
                            +{(cls.studentCount || 0) - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 text-xs">
                        {cls.studentCount === 1 ? '1 student' : `${cls.studentCount || 0} students`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-3 border-slate-100 dark:border-slate-700 border-t">
                    <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-xl">
                      <FaUsers className="text-brand-500 text-xs" />
                      <span className="font-bold text-brand-700 dark:text-brand-400 text-sm">
                        {cls.studentCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                      <FaClock className="text-xs" />
                      <span>{formatDate(cls.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal onClose={closeModal}>
          <h3 className="flex items-center gap-2 mb-5 font-poppins font-black text-slate-800 dark:text-white text-xl">
            {editingId ? <><FaEdit /> Edit Class</> : <><FaPlus /> Add New Class</>}
          </h3>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block mb-1.5 font-bold text-slate-600 dark:text-slate-300 text-xs">Class Name *</label>
              <input
                type="text"
                placeholder="e.g. 8-A"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                autoFocus
                className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block mb-1.5 font-bold text-slate-600 dark:text-slate-300 text-xs">Description (optional)</label>
              <input
                type="text"
                placeholder="Brief description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-2xl font-extrabold text-slate-600 dark:text-slate-300 text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.name?.trim()}
              className="flex flex-[2] justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 py-3 border-none rounded-2xl font-extrabold text-white text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                "Saving..."
              ) : editingId ? (
                <><FaCheck /> Update</>
              ) : (
                <><FaPlus /> Create</>
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal onClose={closeDeleteModal}>
          <div className="text-center">
            <div className="flex justify-center items-center bg-red-100 dark:bg-red-900/40 mx-auto mb-4 rounded-full w-16 h-16">
              <FaTrash className="text-red-500 text-2xl" />
            </div>
            <h3 className="mb-2 font-poppins font-black dark:text-white text-xl">Delete Class?</h3>
            <p className="mb-5 text-slate-500 dark:text-slate-400 text-sm">
              Students in this class will be unassigned. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-2xl font-extrabold text-slate-600 dark:text-slate-300 text-sm transition-colors cursor-pointer"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex flex-[2] justify-center items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 py-3 border-none rounded-2xl font-extrabold text-white text-sm transition-all cursor-pointer"
              >
                {loading ? "Deleting..." : <><FaTrash /> Delete</>}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

