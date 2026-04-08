import { Zap } from 'lucide-react'

const LIMITS = { free: 3, solo: 30, team: 999999, scale: 999999 }

export default function QuotaBar({ user, onUpgrade }) {
  const limit = LIMITS[user?.tier] ?? 3
  const used = user?.quotaUsed ?? 0
  const isUnlimited = limit >= 999999
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100)
  const isNearLimit = !isUnlimited && used >= limit * 0.8
  const isAtLimit = !isUnlimited && used >= limit

  if (isUnlimited) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Zap size={12} className="text-brand-400" />
        <span>Unlimited repurposes</span>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Zap size={11} />
          {used} / {limit} this month
        </span>
        {isNearLimit && (
          <button onClick={onUpgrade} className="text-brand-400 hover:text-brand-300 transition-colors">
            Upgrade
          </button>
        )}
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-brand-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
