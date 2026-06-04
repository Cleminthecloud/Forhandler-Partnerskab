import { ImageResponse } from "next/og";

/* App icon — used by the manifest + standard favicon. Rendered at 512x512
   so it scales down crisply for the launcher and home-screen icons across
   iOS, Android, and desktop. Carl Ras blue background, white "CR" wordmark.
   The padding around the letters works as the safe area for maskable mode
   (Android may crop the corners into a circle/squircle). */

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          // Inter is bundled with Next via next/font on the page; for the
          // icon we let ImageResponse fall back to its default sans-serif
          // — looks fine at this size and avoids fetching webfonts at build
          // time which can flake on Vercel cold builds.
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 800,
          fontSize: 220,
          letterSpacing: -8,
        }}
      >
        CR
      </div>
    ),
    { ...size }
  );
}
