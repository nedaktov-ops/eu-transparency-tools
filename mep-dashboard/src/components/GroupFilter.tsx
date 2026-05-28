import { MEP_GROUPS } from '../lib/constants.ts'

interface GroupFilterProps {
  activeGroup: string
  onChange: (code: string) => void
}

export default function GroupFilter({ activeGroup, onChange }: GroupFilterProps) {
  const groups = Object.values(MEP_GROUPS)

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange('')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          activeGroup === ''
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {groups.map(group => (
        <button
          key={group.code}
          onClick={() => onChange(group.code)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeGroup === group.code
              ? 'text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={{
            backgroundColor: activeGroup === group.code ? group.color : undefined,
          }}
        >
          <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
            style={{ backgroundColor: group.color }}
          />
          {group.label}
        </button>
      ))}
    </div>
  )
}
