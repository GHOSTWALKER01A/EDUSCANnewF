import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Building2, CalendarDays, Edit3, LogOut, Shield, Loader2, QrCode } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/src/components/UI/Button";
import type { Profile } from "../../../types/class.types";
import api from "../../../lib/api";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

type Props = {
  profile: Profile;
  onEditClick: () => void;
  onLogout: () => Promise<void> | void;
  onQrClick?: () => void;
};

export default function ProfileHeader({ profile, onEditClick, onLogout, onQrClick }: Props) {
  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [localPhoto, setLocalPhoto] = useState(profile.profilePhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalPhoto(profile.profilePhoto);
  }, [profile.profilePhoto]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilephoto", file);

    try {
      setIsUploading(true);
      await api.put("/teacher/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Profile photo updated successfully!");
      // Reload the page to sync profile state across the app
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to upload photo", error);
      toast.error(error?.response?.data?.message || "Failed to update profile photo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden" 
      animate="visible" 
      className="relative overflow-hidden bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 md:p-8 rounded-3xl shadow-2xl shadow-black/10 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        
        {/* Profile Image */}
        <motion.div variants={itemVariants} className="shrink-0 relative">
          <div 
             className={`w-36 h-36 md:w-44 md:h-44 flex-shrink-0 rounded-full border-4 border-[var(--card-bg)] shadow-[0_0_0_4px_rgba(var(--accent-rgb),0.3)] overflow-hidden bg-[var(--bg-secondary)] relative z-10 group-hover:shadow-[0_0_0_4px_rgba(var(--accent-rgb),0.6)] transition-shadow duration-500 ${isUploading ? 'cursor-wait' : 'cursor-pointer'}`}
             onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoChange} 
            />
            {localPhoto && !imgError ? (
              <img 
                src={localPhoto} 
                alt={`${profile.fullname}'s Profile`} 
                className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ${isUploading ? 'opacity-50 blur-sm' : ''}`} 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br from-indigo-500 to-[var(--accent)] flex items-center justify-center text-white text-5xl font-bold uppercase shadow-inner ${isUploading ? 'opacity-50 blur-sm' : ''}`}>
                {profile.fullname?.[0] || '?'}
              </div>
            )}
            
            {/* Overlay for "CHANGE PHOTO" */}
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-sm font-semibold tracking-wider gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>UPLOADING...</span>
                </>
              ) : (
                <span>CHANGE PHOTO</span>
              )}
            </div>
          </div>
          {/* Decorative rotating accent ring behind image */}
          <div className="absolute inset-[-8px] rounded-full border border-[var(--accent)]/30 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none" />
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 w-full text-center md:text-left">
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">
              {profile.fullname}
            </h1>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full text-sm font-semibold">
               <Shield className="w-4 h-4" />
               Teacher ID: {profile.id}
            </div>
          </motion.div>

          {/* Info Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-[var(--text-secondary)] font-medium">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]/30"><Mail className="w-4 h-4 text-indigo-400" /></div>
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]/30"><Building2 className="w-4 h-4 text-emerald-400" /></div>
              <span className="truncate">{profile.department || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]/30"><CalendarDays className="w-4 h-4 text-rose-400" /></div>
              <span>Joined {profile.joinDate}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
            {onQrClick && (
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onQrClick} 
                aria-label="Attendance QR"
                className="group relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-semibold shadow-lg shadow-[var(--accent)]/30 hover:shadow-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <QrCode className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Attendance Dashboard</span>
              </motion.button>
            )}
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEditClick} 
              aria-label="Edit Profile"
              className="group relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]/50 text-[var(--text-primary)] font-semibold shadow-md hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-[var(--accent)]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Edit3 className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Edit Profile</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout} 
              disabled={isLoggingOut}
              aria-label="Log out"
              className="group relative flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-red-500/30 text-red-500 font-semibold shadow-md hover:bg-red-500 hover:text-white hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              )}
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
