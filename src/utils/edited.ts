export const getTimeAgoString = (
  updatedAt: string,
  now: Date = new Date()
): string => {
  const updatedDate = new Date(updatedAt);
  const diffMs = now.getTime() - updatedDate.getTime(); // diferencia en milisegundos
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return `Edited ${diffSeconds} seconds ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `Edited ${diffMinutes} minutes ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Edited ${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `Edited ${diffDays} days ago`;
};
