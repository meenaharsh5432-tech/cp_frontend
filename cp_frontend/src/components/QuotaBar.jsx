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
      <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-200 shadow-sm px-3 py-2.5 rounded-xl font-bold">
        <Zap size={14} className="text-brand-500" />
        <span>Unlimited repurposes active</span>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-600 flex items-center gap-1.5 font-semibold">
          <Zap size={13} className={isNearLimit ? 'text-amber-500' : 'text-slate-400'} />
          <span className={isNearLimit ? 'text-amber-600 font-bold' : 'text-slate-600'}>
            {used} / {limit} this month
          </span>
        </span>
        {isNearLimit && (
          <button onClick={onUpgrade} className="text-brand-600 hover:text-brand-700 font-bold transition-colors text-xs">
            Upgrade
          </button>
        )}
      </div>
      <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
        <div
          className={`h-full rounded-full transition-all duration-500 shadow-sm ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-400 to-indigo-500'
            }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
