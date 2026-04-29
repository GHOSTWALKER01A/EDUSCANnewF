import React from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Activity, FileText, MessageSquare } from "lucide-react";

type Props = {
  onClassesAttendedClick?: () => void;
  onAssignmentsClick?: () => void;
  onPendingDoubtsClick?: () => void;
  onAttendanceRateClick?: () => void;
  pendingDoubtsCount?: number;
  classesAttended?: number;
  totalClasses?: number;
  attendanceRate?: number;
  activeAssignmentsCount?: number;
}

export default function StatsGrid({ 
  onClassesAttendedClick, 
  onAssignmentsClick, 
  onPendingDoubtsClick, 
  onAttendanceRateClick,
  pendingDoubtsCount = 0,
  classesAttended = 0,
  totalClasses = 0,
  attendanceRate = 0,
  activeAssignmentsCount = 0
}: Props) {
  const stats = [
    { label: "Classes Attended", value: `${classesAttended}/${totalClasses}`, icon: CheckCircle2, color: "emerald", metric: "attended", valueColor: "text-emerald-400" },
    { label: "Attendance Rate", value: `${attendanceRate}%`, icon: Activity, color: "rose", metric: "rate", valueColor: "text-rose-400" },
    { label: "Assignments Active", value: activeAssignmentsCount.toString(), icon: FileText, color: "indigo", metric: "active", valueColor: "text-indigo-400" },
    { label: "Pending Doubts", value: pendingDoubtsCount.toString(), icon: MessageSquare, color: "amber", metric: "pending", valueColor: "text-amber-400" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500', groupHoverText: 'group-hover:text-emerald-400', hoverBorder: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10' };
      case 'rose': return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-500', groupHoverText: 'group-hover:text-rose-400', hoverBorder: 'hover:border-rose-500/40 hover:shadow-rose-500/10' };
      case 'indigo': return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-500', groupHoverText: 'group-hover:text-indigo-400', hoverBorder: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10' };
      case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', groupHoverText: 'group-hover:text-amber-400', hoverBorder: 'hover:border-amber-500/40 hover:shadow-amber-500/10' };
      default: return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', groupHoverText: 'group-hover:text-blue-400', hoverBorder: 'hover:border-blue-500/40 hover:shadow-blue-500/10' };
    }
  };

  return (
    <motion.div 
       variants={containerVariants}
       initial="hidden"
       animate="visible"
       className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color);
        return (
          <motion.div 
            key={i} 
            variants={itemVariants} 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => {
              if (stat.metric === 'attended' && onClassesAttendedClick) onClassesAttendedClick();
              if (stat.metric === 'active' && onAssignmentsClick) onAssignmentsClick();
              if (stat.metric === 'pending' && onPendingDoubtsClick) onPendingDoubtsClick();
              if (stat.metric === 'rate' && onAttendanceRateClick) onAttendanceRateClick();
            }}
            className={`group relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 rounded-2xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300 ${colors.hoverBorder} ${(stat.metric === 'attended' || stat.metric === 'active' || stat.metric === 'pending' || stat.metric === 'rate') ? 'cursor-pointer hover:shadow-[var(--accent)]/10 hover:border-[var(--accent)]/50' : 'cursor-default'}`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 ${colors.text}`}>
               <Icon className="w-16 h-16" />
            </div>
            
            <div className="relative z-10 w-full">
               <div className={`${colors.bg} w-fit p-2.5 rounded-xl border ${colors.border} mb-4`}>
                 <Icon className={`w-5 h-5 ${colors.text}`} />
               </div>
               
               <h3 className="text-sm text-[var(--text-secondary)] font-medium tracking-wide uppercase">{stat.label}</h3>
               
               <div className="mt-2 flex items-baseline gap-2">
                 <span className={`text-3xl font-extrabold text-[var(--text-primary)] transition-colors ${colors.groupHoverText}`}>
                   {stat.value}
                 </span>
                 <span className="text-sm font-medium text-[var(--text-secondary)]">{stat.metric}</span>
               </div>
               
               <button className="mt-3 text-xs font-semibold text-[var(--accent)] hover:text-indigo-400 transition-colors flex items-center gap-1 group/btn">
                 View details <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
               </button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
