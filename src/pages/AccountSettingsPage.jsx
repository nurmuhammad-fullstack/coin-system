// src/pages/AccountSettingsPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Card, Avatar, SectionLabel, BackButton } from "../components/ui";
import { FaUser, FaLock, FaInfoCircle, FaCoins, FaCamera, FaImage } from "react-icons/fa";

const COLORS = [
  "#22c55e", "#3b82f6", "#ef4444", "#f59e0b", 
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
];

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser, uploadAvatar, showToast } = useApp();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [color, setColor] = useState(currentUser?.color || "#22c55e");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Keep avatarPreview in sync with currentUser's avatar
  const [avatarPreview, setAvatarPreview] = useState(() => {
    const avatar = currentUser?.avatar;
    if (avatar && (avatar.startsWith('/uploads') || avatar.startsWith('http') || avatar.startsWith('data:'))) {
      return avatar;
    }
    return "";
  });

  // Sync with currentUser when it changes
  useEffect(() => {
    const avatar = currentUser?.avatar;
    if (avatar && (avatar.startsWith('/uploads') || avatar.startsWith('http') || avatar.startsWith('data:'))) {
      // Only update if we don't have a pending preview
      setAvatarPreview(avatar);
    }
  }, [currentUser?.avatar]);

  // Check if avatar is an uploaded image
  const isImageAvatar = currentUser?.avatar && (currentUser?.avatar.startsWith('/uploads') || currentUser?.avatar.startsWith('http') || currentUser?.avatar.startsWith('data:'));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast("Please select an image file", "error");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be less than 5MB", "error");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    const result = await uploadAvatar(file);
    setUploading(false);

    if (result.ok) {
      showToast("Profile image updated!");
    } else {
      showToast(result.message || "Failed to upload image", "error");
      // Reset preview on error
      setAvatarPreview(currentUser?.avatar || "");
    }
  };

  const handleUseInitials = () => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    // Clear avatarPreview to show initials
    setAvatarPreview("");
  };

  const previewDisplay = avatarPreview || (name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    
    // If avatarPreview is empty, user wants to use initials
    // Otherwise, keep the current avatar (either uploaded or existing)
    let finalAvatar;
    if (!avatarPreview || avatarPreview === "") {
      finalAvatar = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    } else if (avatarPreview.startsWith('/uploads') || avatarPreview.startsWith('http') || avatarPreview.startsWith('data:')) {
      // Keep the uploaded image path
      finalAvatar = currentUser?.avatar;
    } else {
      finalAvatar = avatarPreview;
    }
    
    setLoading(true);
    const result = await updateCurrentUser({
      name: name.trim(),
      email: email.trim(),
      avatar: finalAvatar,
      color,
    });
    setLoading(false);
    
    if (result.ok) {
      showToast("Profile updated successfully!");
    } else {
      showToast(result.message || "Failed to update profile", "error");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill in all password fields", "error");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    
    if (newPassword.length < 4) {
      showToast("Password must be at least 4 characters", "error");
      return;
    }
    
    setLoading(true);
    const result = await updateCurrentUser({
      password: newPassword,
    });
    setLoading(false);
    
    if (result.ok) {
      showToast("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showToast(result.message || "Failed to change password", "error");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 dark:from-slate-900 via-slate-100 dark:via-slate-800 to-slate-50 dark:to-slate-900 p-4 md:p-8 min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden">
        <BackButton onClick={() => navigate(-1)} label="Back" />
        <h1 className="font-poppins font-black text-slate-800 dark:text-white text-2xl">Account Settings</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <div>
          <h1 className="font-poppins font-black text-slate-800 dark:text-white text-3xl">Account Settings</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Manage your profile and security settings</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-600 dark:text-slate-300 text-sm transition-colors cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden gap-6 md:grid md:grid-cols-3 mx-auto max-w-6xl">
        {/* Left Column - Profile */}
        <div className="space-y-6 col-span-2">
          {/* Profile Info Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex justify-center items-center bg-brand-100 dark:bg-brand-900/50 rounded-xl w-10 h-10">
                <FaUser className="text-brand-500 dark:text-brand-400" />
              </div>
              <div>
                <h2 className="font-poppins font-bold text-slate-800 dark:text-white text-lg">Profile Information</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs">Update your personal details</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="group relative mb-3">
                {/* Show uploaded image or avatar */}
                {isImageAvatar || avatarPreview?.startsWith('data:') ? (
                  <img 
                    src={avatarPreview?.startsWith('data:') ? avatarPreview : avatarPreview} 
                    alt="Profile" 
                    className="border-4 border-white dark:border-slate-700 rounded-full w-24 h-24 object-cover"
                  />
                ) : (
                  <Avatar user={{ avatar: previewDisplay, color }} size={100} />
                )}
                
                {/* Upload overlay */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer"
                >
                  <FaCamera className="text-white text-2xl" />
                </div>
                
                {uploading && (
                  <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-full">
                    <div className="border-2 border-white border-t-transparent rounded-full w-6 h-6 animate-spin" />
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-brand-100 hover:bg-brand-200 dark:bg-brand-900/50 dark:hover:bg-brand-800 px-3 py-1.5 rounded-lg font-bold text-brand-600 dark:text-brand-400 text-xs transition-colors cursor-pointer"
                >
                  <FaImage /> Upload Photo
                </button>
                <button 
                  onClick={handleUseInitials}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  <FaUser /> Use Initials
                </button>
              </div>
            </div>

            <div className="gap-4 grid grid-cols-2">
              <div>
                <label className="block mb-2 font-bold text-slate-600 dark:text-slate-300 text-sm">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white dark:bg-slate-700 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-bold text-slate-600 dark:text-slate-300 text-sm">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white dark:bg-slate-700 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-3 font-bold text-slate-600 dark:text-slate-300 text-sm">Avatar Color</label>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full transition-all cursor-pointer ${color === c ? "ring-4 ring-offset-2 ring-slate-300 dark:ring-slate-600 scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 mt-6 px-6 py-3 border-none rounded-xl w-full font-extrabold text-white text-sm transition-colors cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </Card>

          {/* Change Password Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex justify-center items-center bg-amber-100 dark:bg-amber-900/50 rounded-xl w-10 h-10">
                <FaLock className="text-amber-500 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-poppins font-bold text-slate-800 dark:text-white text-lg">Change Password</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs">Update your security credentials</p>
              </div>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block mb-2 font-bold text-slate-600 dark:text-slate-300 text-sm">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white dark:bg-slate-700 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="gap-4 grid grid-cols-2">
                <div>
                  <label className="block mb-2 font-bold text-slate-600 dark:text-slate-300 text-sm">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white dark:bg-slate-700 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-bold text-slate-600 dark:text-slate-300 text-sm">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white dark:bg-slate-700 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 mt-2 px-6 py-3 border-none rounded-xl w-full font-extrabold text-white dark:text-slate-100 text-sm transition-colors cursor-pointer"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column - Account Info */}
        <div className="space-y-6">
          {/* Account Summary */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex justify-center items-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl w-10 h-10">
                <FaInfoCircle className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="font-poppins font-bold text-slate-800 dark:text-white text-lg">Account Info</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs">Your account details</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-xl">
                <span className="font-medium text-slate-500 dark:text-slate-400 text-sm">Role</span>
                <span className="bg-white dark:bg-slate-600 px-3 py-1 rounded-lg font-bold text-slate-700 dark:text-slate-200 capitalize">{currentUser?.role}</span>
              </div>
              
              {currentUser?.class && (
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-xl">
                  <span className="font-medium text-slate-500 dark:text-slate-400 text-sm">Class</span>
                  <span className="bg-white dark:bg-slate-600 px-3 py-1 rounded-lg font-bold text-slate-700 dark:text-slate-200">{currentUser.class}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <FaCoins className="text-amber-500" />
                  <span className="font-medium text-slate-500 dark:text-slate-400 text-sm">Coins</span>
                </div>
                <span className="font-black text-brand-600 dark:text-brand-400 text-lg">{currentUser?.coins?.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-brand-50 dark:bg-brand-900/30 p-6">
            <h3 className="mb-4 font-poppins font-bold text-slate-800 dark:text-white">Quick Tips</h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-500">•</span>
                Keep your profile information up to date
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-500">•</span>
                Use a strong password with at least 4 characters
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-500">•</span>
                Choose a unique avatar color to stand out
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4 p-5">
        <BackButton onClick={() => navigate(-1)} label="Back" />
        
        <h1 className="font-poppins font-black text-slate-800 dark:text-white text-2xl">Account Settings</h1>

        {/* Profile Info */}
        <Card className="p-5">
          <SectionLabel>Profile Information</SectionLabel>
          
          <div className="flex flex-col items-center mb-5">
            <div className="group relative mb-3">
              {/* Show uploaded image or avatar */}
              {isImageAvatar || avatarPreview?.startsWith('data:') ? (
                <img 
                  src={avatarPreview?.startsWith('data:') ? avatarPreview : avatarPreview} 
                  alt="Profile" 
                  className="border-4 border-white dark:border-slate-700 rounded-full w-20 h-20 object-cover"
                />
              ) : (
                <Avatar user={{ avatar: previewDisplay, color }} size={80} />
              )}
              
              {/* Upload overlay */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer"
              >
                <FaCamera className="text-white text-xl" />
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1 bg-brand-100 hover:bg-brand-200 dark:bg-brand-900/50 dark:hover:bg-brand-800 px-3 py-1.5 rounded-lg font-bold text-brand-600 dark:text-brand-400 text-xs transition-colors cursor-pointer"
              >
                <FaImage /> Upload
              </button>
              <button 
                onClick={handleUseInitials}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer"
              >
                <FaUser /> Initials
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block mb-1 font-bold text-slate-600 dark:text-slate-300 text-xs">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white dark:bg-slate-700 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-bold text-slate-600 dark:text-slate-300 text-xs">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-slate-700 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-600 dark:text-slate-300 text-xs">Avatar Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${color === c ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 mt-5 py-2.5 border-none rounded-xl w-full font-extrabold text-white text-sm transition-colors cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </Card>

        {/* Change Password */}
        <Card className="p-5">
          <SectionLabel>Change Password</SectionLabel>
          
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block mb-1 font-bold text-slate-600 dark:text-slate-300 text-xs">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-white dark:bg-slate-700 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-bold text-slate-600 dark:text-slate-300 text-xs">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white dark:bg-slate-700 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-bold text-slate-600 dark:text-slate-300 text-xs">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white dark:bg-slate-700 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl w-full font-bold text-slate-700 dark:text-slate-200 text-sm"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 mt-2 py-2.5 border-none rounded-xl w-full font-extrabold text-white dark:text-slate-100 text-sm transition-colors cursor-pointer"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </Card>

        {/* Account Info */}
        <Card className="p-5">
          <SectionLabel>Account Information</SectionLabel>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-slate-500 dark:text-slate-400">Role</span>
              <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">{currentUser?.role}</span>
            </div>
            {currentUser?.class && (
              <div className="flex justify-between">
                <span className="font-medium text-slate-500 dark:text-slate-400">Class</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{currentUser.class}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-slate-500 dark:text-slate-400">Coins</span>
              <span className="font-bold text-brand-600 dark:text-brand-400">{currentUser?.coins?.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

