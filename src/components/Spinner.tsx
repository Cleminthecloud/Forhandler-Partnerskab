/* Small inline spinner — for submit-button loading states.
   Sized to sit comfortably next to button labels. Uses currentColor so
   it inherits the button's text color (white on primary, ink on
   secondary). No global animation — uses a scoped @keyframes inside
   the SVG so it works even when global animations are disabled. */
export function Spinner({ size = 14, label = "Indlæser" }: { size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
      style={{ display: "inline-block", animation: "spinner-rotate 700ms linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <style>{`@keyframes spinner-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
