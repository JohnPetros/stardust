'use server'

export async function getUpdatedLevel(updatedXp: number, currentLevel: number) {
  const hasNewLevel = updatedXp >= 50 * (currentLevel - 1) + 25

  if (hasNewLevel) {
    const newLevel = currentLevel + 1
    return {
      hasNewLevel: true,
      level: newLevel,
    }
  }

  return {
    hasNewLevel: false,
    level: currentLevel,
  }
}
