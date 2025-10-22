export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Just now
  if (diffMins < 1) return 'Just now';
  // Minutes ago
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  // Hours ago
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  // Days ago
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  // Full date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatXP = (xp: number): string => {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M XP`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`;
  }
  return `${xp} XP`;
};

export const formatStreak = (streak: number): string => {
  if (streak === 0) return '0 days';
  if (streak === 1) return '1 day';
  return `${streak} days`;
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};