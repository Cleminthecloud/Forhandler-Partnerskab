import { ImageResponse } from "next/og";

/* Apple touch icon — used by iOS Safari "Add to Home Screen". Sized 180×180
   per Apple's spec. Slightly tighter padding than the regular icon because
   iOS automatically applies the rounded-rectangle mask without a safe area. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1158A3 0%, #0C447C 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 800,
          fontSize: 84,
          letterSpacing: -3,
        }}
      >
        CR
      </div>
    ),
    { ...size }
  );
}
