/* Icon set — same visual language as the sidebar menu icons.
   Stroke = currentColor · 24×24 viewBox · 1.7 stroke-width.
   Add new icons here when needed instead of inlining SVG. */

export type IconName =
  | "calendar"
  | "phone"
  | "phone-call"
  | "mail"
  | "plus"
  | "check"
  | "check-circle"
  | "alert-triangle"
  | "lightbulb"
  | "wrench"
  | "file-text"
  | "handshake"
  | "ellipsis"
  | "user"
  | "users"
  | "home"
  | "send"
  | "external"
  | "clock"
  | "history"
  | "map-pin"
  | "shield"
  | "lock"
  | "graduation-cap"
  | "book-open"
  | "play"
  | "chevron-right"
  | "chevron-down"
  | "x";

const PATHS: Record<IconName, React.ReactNode> = {
  calendar:    <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  phone:       <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  "phone-call":<><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /><path d="M16 3a5 5 0 015 5M16 7a1 1 0 011 1" /></>,
  mail:        <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></>,
  plus:        <path d="M12 5v14M5 12h14" />,
  check:       <path d="M5 13l4 4L19 7" />,
  "check-circle": <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>,
  "alert-triangle": <><path d="M12 3l10 17H2z" /><path d="M12 10v5M12 18v.5" /></>,
  lightbulb:   <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z" /></>,
  wrench:      <path d="M15 6a4 4 0 11-1 7l-6 6-3-3 6-6a4 4 0 014-4z" />,
  "file-text": <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  handshake:   <path d="M3 11l3-3 4 1 2-2 5 5-2 2-2-2-2 2-2-2-3 3-3-4z" />,
  ellipsis:    <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
  user:        <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  users:       <><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><path d="M16 4a4 4 0 010 8M17 14c3 .5 5 2.5 5 5" /></>,
  home:        <path d="M3 12l9-9 9 9M5 10v10h14V10" />,
  send:        <path d="M21 3L3 11l7 3 3 7 8-18z M10 14l11-11" />,
  external:    <><path d="M14 4h6v6" /><path d="M20 4l-9 9M19 13v6H5V5h6" /></>,
  clock:       <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  history:     <><path d="M3 12a9 9 0 109-9c-2.5 0-4.7 1-6.4 2.6L3 8" /><path d="M3 3v5h5" /><path d="M12 8v4l3 2" /></>,
  "map-pin":   <><path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  shield:      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
  lock:        <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></>,
  "graduation-cap": <><path d="M2 9l10-5 10 5-10 5L2 9z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>,
  "book-open": <><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z" /><path d="M12 6v14" /></>,
  play:        <path d="M6 4l14 8-14 8V4z" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
  "chevron-down":  <path d="M6 9l6 6 6-6" />,
  x:           <path d="M18 6L6 18M6 6l12 12" />,
};

export function Icon({
  name,
  size = 16,
  stroke = 1.7,
  className = "",
  filled = false,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"shrink-0 " + className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
