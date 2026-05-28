"use client";
import { useState, useSyncExternalStore, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* =====================================================================
   MobileGate — shown on routes that haven't been rebuilt mobile-first.
   The "pitch-critical" hero screens (dashboard, kampagner, find, lead
   detail, tier benefits) are excluded — they ARE the mobile experience
   we want Peter to see. Everything else gets a polite "switch to desktop
   for the full experience" screen with a continue-anyway button.

   Implementation notes (mobile-first responsive done right):
   - Sized in dvh/dvw so it handles iOS Safari's collapsing chrome
   - clamp() typography so it scales fluidly between 320-768px
   - "Continue anyway" persists per-session via sessionStorage
   - Renders nothing on >=md viewports (the gate is purely mobile)
   ===================================================================== */

/** Routes that are mobile-first ready (or will be after the rebuild).
 *  Use startsWith — covers nested routes like /find/[partnerId]. */
const MOBILE_READY_PREFIXES = [
  "/partner",            // dashboard
  "/partner/kampagner",  // signature demo
  "/find",               // customer-facing
  "/partner/leads",      // lead detail
] as const;

/** Routes that should NEVER show the gate even if not in the ready list
 *  (e.g. landing pages, auth flows). */
const ALWAYS_ALLOWED_PREFIXES = [
  "/find",
] as const;

const SESSION_KEY = "carl-ras-mobile-continued";

/* useSyncExternalStore hooks for reading the "continue anyway" flag from
   sessionStorage. The React 19 strict ESLint rule won't let us setState
   inside a useEffect for state sync, so we use the proper external-store
   pattern instead. */
function subscribeNoop() { return () => {}; }
function getSnapshot() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
function getServerSnapshot() { return false; }

export function MobileGate() {
  const pathname = usePathname() ?? "";
  const sessionContinued = useSyncExternalStore(subscribeNoop, getSnapshot, getServerSnapshot);
  const [localContinued, setLocalContinued] = useState(false);
  const continued = sessionContinued || localContinued;

  const handleContinue = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    setLocalContinued(true);
  }, []);

  const isMobileReady =
    MOBILE_READY_PREFIXES.some((p) =>
      pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}?`)
    ) || ALWAYS_ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));

  // If the user clicked "continue anyway" OR we're on a ready route, render nothing
  if (continued || isMobileReady) return null;

  return (
    <div
      className="md:hidden fixed inset-0 z-[80] flex flex-col bg-[var(--canvas)]"
      style={{ minHeight: "100dvh" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-gate-title"
    >
      {/* Carl Ras blue header strip */}
      <div className="bg-[var(--accent)] text-white" style={{ paddingBlock: "clamp(12px, 3vw, 18px)", paddingInline: "clamp(16px, 4vw, 24px)" }}>
        <div className="text-[12px] uppercase tracking-[0.16em] font-semibold opacity-80">Carl Ras Partner</div>
        <div className="font-semibold mt-1" style={{ fontSize: "clamp(16px, 4vw, 19px)" }}>Forhandler Partnerskabet</div>
      </div>

      {/* Body */}
      <div
        className="flex-1 flex flex-col"
        style={{
          paddingInline: "clamp(20px, 6vw, 32px)",
          paddingBlock: "clamp(24px, 8vw, 48px)",
          gap: "clamp(20px, 5vw, 32px)",
        }}
      >
        <div>
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            Bedst på desktop
          </div>
          <h1
            id="mobile-gate-title"
            className="font-semibold text-[var(--ink)] tracking-tight"
            style={{
              fontSize: "clamp(26px, 7vw, 36px)",
              lineHeight: 1.15,
              marginBlockStart: "clamp(12px, 3vw, 16px)",
              letterSpacing: "-0.012em",
            }}
          >
            Denne side er bygget til en stor skærm.
          </h1>
          <p
            className="text-[var(--ink-2)]"
            style={{
              fontSize: "clamp(15px, 4vw, 17px)",
              lineHeight: 1.5,
              marginBlockStart: "clamp(12px, 3vw, 16px)",
            }}
          >
            Forhandler-portalen rummer mange dybe arbejdsflader — kalender, projekt-planlægning, tilbudsmotor. De fungerer bedst på desktop eller tablet i landskab.
          </p>
        </div>

        {/* What works on mobile — quick list of links to the rebuilt screens */}
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-3">Disse skærme fungerer på mobil</div>
          <ul className="flex flex-col gap-2.5">
            <MobileGateLink href="/partner" label="Min oversigt" subtitle="Leads, kampagner, tier-progress" />
            <MobileGateLink href="/partner/kampagner" label="Kampagner" subtitle="Bestil flyer, send til Meta/Google" />
            <MobileGateLink href="/find" label="Find en partner" subtitle="Lokalsøgning blandt 47 partnere" />
            <MobileGateLink href="/partner/leads" label="Mine leads" subtitle="Indbakke fra carl-ras.dk" />
          </ul>
        </div>

        {/* Continue anyway — small, secondary, lives at the bottom */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <button
            onClick={handleContinue}
            className="w-full text-center text-[14px] font-medium text-[var(--ink-3)] hover:text-[var(--ink)] py-3"
            style={{ minHeight: 44 }}
          >
            Fortsæt alligevel
          </button>
          <p className="text-[11.5px] text-[var(--ink-4)] text-center leading-[1.5]">
            Layout kan se mærkeligt ud — vi har valgt at vise sandheden i stedet for at lade som om.
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileGateLink({ href, label, subtitle }: { href: string; label: string; subtitle: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-[var(--r-md)] bg-[var(--canvas-2)] hover:bg-[var(--canvas-3)] transition-colors active:scale-[0.98]"
        style={{ paddingBlock: "clamp(12px, 3vw, 14px)", paddingInline: "clamp(14px, 4vw, 18px)", minHeight: 56 }}
      >
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[var(--ink)]" style={{ fontSize: "clamp(14px, 3.8vw, 15px)" }}>{label}</div>
          <div className="text-[var(--ink-3)] mt-0.5" style={{ fontSize: "clamp(12px, 3vw, 13px)" }}>{subtitle}</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink-3)] shrink-0">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
    </li>
  );
}
