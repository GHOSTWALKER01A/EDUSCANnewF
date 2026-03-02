


export default function RiskBadge({ value }: { value?: number }) {
  if (value == null) return <span>—</span>

  const cls =
    value >= 70 ? 'bg-red-600' :
    value >= 40 ? 'bg-yellow-500 text-black' :
    'bg-green-600'

  return (
    <span className={`px-2 py-1 rounded text-white text-xs ${cls}`}>
      {value}%
    </span>
  )
}
