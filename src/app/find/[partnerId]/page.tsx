"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PARTNERS } from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { useApp } from "@/components/AppState";

export default function PartnerProfilePage({ params }: { params: Promise<{ partnerId: string }> }) {
  const { partnerId } = use(params);
  const partner = PARTNERS.find((p) => p.id === partnerId);
  const { addLead, pushToast } = useApp();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    kunde: "",
    postnr: "",
    by: "",
    telefon: "",
    email: "",
    behov: "",
    beskrivelse: "",
    tema: THEMES[0].id,
  });

  if (!partner) {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Partner ikke fundet</h1>
        <Link href="/find" className="mt-4 inline-block text-[var(--cr-blue)] font-semibold">← Tilbage til partnerfinder</Link>
      </div>
    );
  }

  const p = partner; // narrowed for inner closures

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kunde || !form.telefon || !form.behov) {
      pushToast("Udfyld venligst navn, telefon og kort beskrivelse af opgaven.");
      return;
    }
    addLead({
      kunde: form.kunde,
      postnr: form.postnr,
      by: form.by,
      telefon: form.telefon,
      email: form.email,
      behov: form.behov,
      beskrivelse: form.beskrivelse,
      tema: form.tema,
      værdi: "Vurderes af partner",
      partnerId: p.id,
    });
    setSubmitted(true);
    pushToast(`Tak! ${p.firma} kontakter dig snart.`);
  }

  return (
    <article className="mx-auto max-w-[1100px] px-6 py-10">
      <Link href="/find" className="text-[13px] font-semibold text-[var(--cr-blue)] hover:underline">← Tilbage til søgning</Link>

      <header className="mt-6 flex flex-wrap items-start gap-6">
        <div className="size-24 rounded-2xl grid place-items-center text-white font-semibold text-[28px] shrink-0" style={{ background: partner.logoBg }}>
          {partner.initialer}
        </div>
        <div className="flex-1 min-w-[280px]">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[34px] font-semibold tracking-tight text-[var(--cr-navy-deep)]">{partner.firma}</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{
              background: partner.tier === "Guld" ? "#FFF4D6" : partner.tier === "Sølv" ? "#F1F3F5" : "#FBE9DC",
              color: partner.tier === "Guld" ? "#7A5300" : partner.tier === "Sølv" ? "#52595E" : "#7A3F12",
            }}>{partner.tier}-partner</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--cr-blue-tint)] text-[var(--cr-navy)]">
              ✓ Carl Ras Certificeret
            </span>
          </div>
          <div className="text-[15px] text-[var(--ink-muted-80)] mt-2">{partner.faggruppe} · {partner.by} ({partner.postnr}) · {partner.region}</div>
          <div className="text-[13px] text-[var(--ink-muted-48)] mt-1">Partner siden {partner.medlemSiden} · {partner.antalSager} løste sager · ★ {partner.rating} ({Math.floor(partner.antalSager * 0.6)} anmeldelser)</div>
          <p className="text-[16px] text-[var(--ink-muted-80)] mt-4 max-w-[680px] leading-relaxed">{partner.beskrivelse}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {partner.specialer.map((s) => (
              <span key={s} className="text-[12px] px-3 py-1 rounded-full bg-[var(--cr-blue-tint)] text-[var(--cr-navy)] font-medium">{s}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left: about + cases */}
        <section>
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>SPECIALIST I</div>
          <h2 className="text-[20px] font-semibold mt-2 text-[var(--cr-navy-deep)]">Sommerhuse langs Nordsjællands kyst</h2>
          <p className="text-[15px] text-[var(--ink-muted-80)] mt-3 leading-relaxed">
            {partner.firma} har serviceret sommerhuse fra Hornbæk til Tisvildeleje siden 2008. Familieejet,
            tre-mands hold, korte responstider og lokalt kendskab til områderne. Specialist i smart-lock
            løsninger til udlejningssommerhuse.
          </p>

          <div className="t-tagline mt-10" style={{ color: "var(--cr-blue)" }}>SENESTE PROJEKTER</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { titel: "Smart-lock installation, Hornbæk", body: "Komplet sikringspakke til 3 udlejningssommerhuse. Ugekoder via app.", pris: "≈ 28.000 kr" },
              { titel: "Alarm-modernisering, Dronningmølle", body: "Udskiftning af 2014-alarm til moderne push-baseret system.", pris: "≈ 14.500 kr" },
              { titel: "ABUS Smart Cylinder, Tisvildeleje", body: "Pilot-installation af STROXX-cylinder. Saltluft-test bestået.", pris: "≈ 9.800 kr" },
              { titel: "Adgangskontrol bryllup, Hellebæk", body: "Midlertidig adgangskontrol til bryllupsweekend i sommerhus.", pris: "≈ 6.200 kr" },
            ].map((c) => (
              <div key={c.titel} className="card !p-4">
                <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)]">{c.titel}</div>
                <p className="text-[12px] text-[var(--ink-muted-80)] mt-1">{c.body}</p>
                <div className="text-[11px] text-[var(--ink-muted-48)] mt-2">{c.pris}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: contact form */}
        <aside className="lg:sticky lg:top-6 self-start">
          {!submitted ? (
            <form onSubmit={submit} className="card">
              <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>BED OM KONTAKT</div>
              <h3 className="text-[20px] font-semibold mt-2 text-[var(--cr-navy-deep)]">{partner.ejer.split(" ")[0]} kontakter dig</h3>
              <p className="text-[13px] text-[var(--ink-muted-48)] mt-1">Typisk inden for 24 timer.</p>

              <div className="mt-4 space-y-3">
                <Field label="Dit navn *">
                  <input type="text" value={form.kunde} onChange={(e) => setForm({ ...form, kunde: e.target.value })} className="form-input" placeholder="For- og efternavn" />
                </Field>
                <Field label="Telefon *">
                  <input type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} className="form-input" placeholder="+45 …" />
                </Field>
                <Field label="Email">
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="dig@email.dk" />
                </Field>
                <div className="grid grid-cols-[110px_1fr] gap-3">
                  <Field label="Postnr">
                    <input type="text" value={form.postnr} onChange={(e) => setForm({ ...form, postnr: e.target.value })} className="form-input" placeholder="3100" />
                  </Field>
                  <Field label="By">
                    <input type="text" value={form.by} onChange={(e) => setForm({ ...form, by: e.target.value })} className="form-input" placeholder="Hornbæk" />
                  </Field>
                </div>
                <Field label="Hvad har du brug for? *">
                  <input type="text" value={form.behov} onChange={(e) => setForm({ ...form, behov: e.target.value })} className="form-input" placeholder="F.eks. Smart lock + alarm" />
                </Field>
                <Field label="Beskrivelse">
                  <textarea rows={3} value={form.beskrivelse} onChange={(e) => setForm({ ...form, beskrivelse: e.target.value })} className="form-input resize-none" placeholder="Kort beskrivelse af opgaven…" />
                </Field>
              </div>

              <button type="submit" className="mt-5 pill pill-primary w-full justify-center !py-3">
                Send forespørgsel
              </button>
              <p className="t-caption mt-3 text-center">
                Vi sender din forespørgsel direkte til {partner.firma}. Carl Ras gemmer ikke dine data.
              </p>
              <style>{`
                .form-input { width: 100%; padding: 10px 12px; border-radius: 10px; background: var(--surface-pearl); font-size: 14px; outline: none; border: 1px solid transparent; transition: all 160ms ease; }
                .form-input:focus { background: white; border-color: var(--cr-blue); }
              `}</style>
            </form>
          ) : (
            <div className="card text-center">
              <div className="text-5xl">✓</div>
              <h3 className="text-[22px] font-semibold text-[var(--cr-navy-deep)] mt-3">Forespørgsel sendt</h3>
              <p className="text-[14px] text-[var(--ink-muted-80)] mt-2">
                {partner.firma} har modtaget din forespørgsel og kontakter dig snarest — typisk inden for 24 timer.
              </p>
              <div className="mt-5 p-4 rounded-xl bg-[var(--cr-blue-tint)] text-left text-[12px]">
                <div className="font-semibold text-[var(--cr-navy-deep)]">Sådan virker partnerflowet</div>
                <p className="text-[var(--ink-muted-80)] mt-1">
                  Forespørgslen lander nu i partnerens lead-indbakke. Skift til <strong>Partner</strong>-rollen i top-højre demo-nav for at se den der.
                </p>
                <button onClick={() => router.push("/partner/leads")} className="pill pill-primary mt-3 text-[12px]">
                  Se lead-indbakken →
                </button>
              </div>
              <button onClick={() => router.push("/find")} className="mt-4 pill pill-light w-full justify-center">
                Tilbage til søgning
              </button>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[var(--ink-muted-80)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
