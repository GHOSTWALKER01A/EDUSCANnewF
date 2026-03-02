import RiskBadge from '../../../components/teachers/studentRecord/riskbadge'
import { toggleStudentBlock } from '../../../lib/toggleBlock'
import type { IUser } from '../../../types/index'
import ToggleSwitch from '../../UI/Toggle'

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
    <tr className="border-t">
      <td>{student.registrationNo}</td>
      <td>
        <strong>{student.fullname}</strong>
        <div className="text-xs opacity-70">{student.email}</div>
      </td>
      <td>{student.semester}</td>
      <td>{student.branch}</td>
      <td>{student.grade ?? '—'}</td>
      <td>{student.attendancePercentage?.toFixed(1) ?? '—'}%</td>
      <td><RiskBadge value={student.riskPercentage} /></td>
      <td>{student.blocked ? 'Blocked' : 'Active'}</td>
      <td className="flex gap-2">
        <button onClick={() => onView(student._id)}>View</button>
       <ToggleSwitch
          checked={!student.blocked}
          onChange={async () => {
            await toggleStudentBlock(student._id, !student.blocked)
            onRefresh()
          }}
        />
      </td>
    </tr>
  )
}
