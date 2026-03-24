import { Badge } from "@/components/ui/badge"

const colorMap = {
  blue:   "text-blue-600",
  green:  "text-green-600",
  gray:   "text-gray-500",
  amber:  "text-amber-600",
  red:    "text-red-500",
  yellow: "text-yellow-500",
  indigo: "text-indigo-500",
} as const

interface StatBadgeProps {
  count: number
  label: string
  color: keyof typeof colorMap
}

export default function StatBadge({ count, label, color }: StatBadgeProps) {
  return (
    <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm gap-1">
      <span className={`font-semibold ${colorMap[color]}`}>{count}</span>
      {label}
    </Badge>
  )
}