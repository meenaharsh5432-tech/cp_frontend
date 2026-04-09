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
      <div className="flex items-center gap-2 text-xs text-gray-400 bg-brand-500/10 px-3 py-2 rounded-lg">
        <Zap size={11} className="text-brand-400" />
        <span className="font-medium">Unlimited repurposes</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500 flex items-center gap-1.5">
          <Zap size={11} className={isNearLimit ? 'text-yellow-400' : 'text-gray-600'} />
          <span className={isNearLimit ? 'text-yellow-400 font-medium' : 'text-gray-500'}>
            {used} / {limit} this month
          </span>
        </span>
        {isNearLimit && (
          <button onClick={onUpgrade} className="text-brand-400 hover:text-brand-300 font-medium transition-colors text-xs">
            Upgrade
          </button>
        )}
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-gradient-to-r from-brand-500 to-brand-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
