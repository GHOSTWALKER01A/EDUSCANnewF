import RiskBadge from '../../../components/teachers/studentRecord/riskbadge'
import { toggleStudentBlock } from '../../../lib/toggleBlock'
import type { IUser } from '../../../types/index'
import ToggleSwitch from '../../UI/Toggle'
import { Eye, ShieldAlert, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'

export default function StudentRow({
  student,
  onView,
  onToggle,
  onRefresh,
}: {
  student: IUser
  onView: (id: string) => void
  onRefresh: () => void
  onToggle: (id: string, blocked: boolean) => void;
}) {
  return (
    <tr className="group hover:bg-[var(--bg-secondary)]/40 transition-colors duration-200">
      <td className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
        {student.registrationNo}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{student.fullname}</span>
          <span className="text-xs text-[var(--text-secondary)]">{student.email}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-semibold">
        {student.grade ? <span className="px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-color)]/30 shadow-sm">{student.grade}</span> : <span className="text-[var(--text-secondary)] opacity-50">—</span>}
      </td>
      <td className="px-6 py-4">
        {student.attendancePercentage !== undefined ? (
          <div className="flex flex-col gap-1.5 w-full max-w-[100px]">
            <div className="flex justify-between items-center text-xs font-bold">
               <span>{student.attendancePercentage.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-color)]/20">
               <div 
                 className={clsx("h-full rounded-full", student.attendancePercentage >= 75 ? "bg-emerald-500" : student.attendancePercentage >= 60 ? "bg-amber-500" : "bg-rose-500")}
                 style={{ width: `${Math.min(100, Math.max(0, student.attendancePercentage))}%` }}
               />
            </div>
          </div>
        ) : <span className="text-[var(--text-secondary)] opacity-50 text-sm">—</span>}
      </td>
      <td className="px-6 py-4">
        <RiskBadge value={student.riskPercentage} />
      </td>
      <td className="px-6 py-4 text-sm font-medium">
         <div className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border", student.blocked ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20")}>
            {student.blocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {student.blocked ? 'Blocked' : 'Active'}
         </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-4">
           {/* View Profile Action */}
           <button 
             onClick={() => onView(student._id)}
             className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]/20 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 focus:outline-none transition-all shadow-sm"
             title="View Details"
           >
             <Eye className="w-4 h-4" />
           </button>
           
           {/* Block/Unblock Action */}
           <div className="scale-90 flex items-center" title={student.blocked ? "Unblock User" : "Block User"}>
             <ToggleSwitch
                checked={!student.blocked}
                onChange={async () => {
                  await toggleStudentBlock(student._id, !student.blocked)
                  onRefresh()
                }}
             />
           </div>
        </div>
      </td>
    </tr>
  )
}
