export default function StatusBadge({ status }) {
  const cls = {
    pending:     "badge badge-pending",
    in_progress: "badge badge-in_progress",
    resolved:    "badge badge-resolved",
  }[status] ?? "badge";

  const label = {
    pending:     "Pending",
    in_progress: "In Progress",
    resolved:    "Resolved",
  }[status] ?? status;

  return <span className={cls}>{label}</span>;
}
