/**
 * Formats a MongoDB ISO date string into a readable format.
 * e.g. "May 14, 2025" or "Today at 2:30 PM"
 */
export function formatDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  const now  = new Date();

  const isToday =
    date.getDate()     === now.getDate() &&
    date.getMonth()    === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return "Today at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate()     === yesterday.getDate() &&
    date.getMonth()    === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" }) +
    " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
