const LIMITS = {
  free: 3,
  solo: 30,
  team: 999999,
  scale: 999999
}

export async function checkQuota(user, prisma) {
  const now = new Date()
  const resetDate = new Date(user.quotaResetAt)
  const monthDiff =
    (now.getFullYear() - resetDate.getFullYear()) * 12 +
    (now.getMonth() - resetDate.getMonth())

  if (monthDiff >= 1) {
    await prisma.user.update({
      where: { id: user.id },
      data: { quotaUsed: 0, quotaResetAt: now }
    })
    user.quotaUsed = 0
  }

  const limit = LIMITS[user.tier] ?? 3
  if (user.quotaUsed >= limit) {
    const err = new Error(
      `Quota exceeded (${user.quotaUsed}/${limit}). Upgrade your plan to continue.`
    )
    err.statusCode = 429
    throw err
  }
}

export async function incrementQuota(userId, prisma) {
  await prisma.user.update({
    where: { id: userId },
    data: { quotaUsed: { increment: 1 } }
  })
}

export function getLimit(tier) {
  return LIMITS[tier] ?? 3
}
