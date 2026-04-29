import React from 'react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { CalendarPlus, ArrowUpRight, FileUp, CalendarDays, Users } from 'lucide-react'

export default function TeacherActionGrid() {
  const actions = [
    {
      title: "Upload Material",
      desc: "Share notes & resources",
      icon: FileUp,
      href: "/teacher/dashboard/teachermaterial",
      color: "text-blue-500",
      bgLight: "bg-blue-500/10",
      borderHover: "hover:border-blue-500/50"
    },
    {
      title: "Create Event",
      desc: "Schedule new activities",
      icon: CalendarPlus,
      href: "/teacher/dashboard/teacherevent",
      color: "text-emerald-500",
      bgLight: "bg-emerald-500/10",
      borderHover: "hover:border-emerald-500/50"
    },
    {
      title: "Manage Schedule",
      desc: "View & edit timings",
      icon: CalendarDays,
      href: "/teacher/dashboard/teacherschedule",
      color: "text-purple-500",
      bgLight: "bg-purple-500/10",
      borderHover: "hover:border-purple-500/50"
    },
    {
      title: "Student Records",
      desc: "Analyze class performance",
      icon: Users,
      href: "/teacher/dashboard/studentrecord",
      color: "text-amber-500",
      bgLight: "bg-amber-500/10",
      borderHover: "hover:border-amber-500/50"
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  }

  return (
    <motion.section
      id="quick-actions"
      className="py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
           <h3 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Quick Actions</h3>
           <p className="text-[var(--text-secondary)] mt-1 font-medium max-w-lg">
             Manage your classroom activities seamlessly. Access your most used tools directly from the portal.
           </p>
        </div>
        <button className="h-10 px-4 rounded-xl border border-[var(--border-color)]/30 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] hover:border-[var(--accent)] transition-all">
          View All Tools
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {actions.map((action, i) => (
          <Link href={action.href} key={i}>
            <motion.div 
               variants={itemVariants}
               whileHover={{ y: -5, transition: { duration: 0.2 } }}
               className={`group bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl p-6 h-full flex flex-col justify-between shadow-xl shadow-black/5 hover:shadow-2xl transition-all ${action.borderHover} relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                 <ArrowUpRight className={`w-5 h-5 ${action.color} opacity-70`} />
              </div>

              <div className={`w-14 h-14 rounded-2xl ${action.bgLight} border border-[var(--border-color)]/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                 <action.icon className={`w-7 h-7 ${action.color}`} strokeWidth={1.5} />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2 group-hover:text-[var(--accent)] transition-colors">{action.title}</h4>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{action.desc}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </motion.section>
  )
}
