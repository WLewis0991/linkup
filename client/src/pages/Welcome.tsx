import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .lu-home * { box-sizing: border-box; }

  .lu-home {
    font-family: 'Nunito', sans-serif;
    min-height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 40px 20px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  /* ambient blobs */
  .lu-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(90px);
  }
  .lu-blob-1 {
    width: 420px; height: 420px;
    top: -120px; left: -100px;
    background: rgba(255, 100, 130, 0.09);
  }
  .lu-blob-2 {
    width: 360px; height: 360px;
    bottom: 60px; right: -80px;
    background: rgba(91, 124, 246, 0.09);
  }

  .lu-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 580px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* ---------- HERO ---------- */
  .lu-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 40px;
  }

  /* logo */
  .lu-logo-wrap {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
    transition: opacity 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.08s,
                transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.08s;
    margin-bottom: 20px;
  }
  .lu-logo-wrap.vis { opacity: 1; transform: translateY(0) scale(1); }

  .lu-logo-bubble {
    width: 72px; height: 72px;
    border-radius: 24px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 28px rgba(255,100,130,0.22), 0 2px 8px rgba(0,0,0,0.12);
  }

  /* wordmark */
  .lu-wordmark {
    font-size: clamp(52px, 11vw, 80px);
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1;
    display: flex; align-items: baseline;
    margin-bottom: 16px;
    opacity: 0;
    transform: translateY(-30px);
    transition: opacity 0.6s cubic-bezier(0.34,1.46,0.64,1) 0.22s,
                transform 0.6s cubic-bezier(0.34,1.46,0.64,1) 0.22s;
  }
  .lu-wordmark.vis { opacity: 1; transform: translateY(0); }

  .lu-word-up {
    -webkit-text-stroke: 3px #ff6482;
    color: transparent;
    letter-spacing: -2px;
  }

  /* pills */
  .lu-pills {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
    margin-bottom: 20px;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.5s ease 0.46s, transform 0.5s ease 0.46s;
  }
  .lu-pills.vis { opacity: 1; transform: translateY(0); }

  .lu-pill {
    font-size: 11px; font-weight: 700; letter-spacing: 0.3px;
    padding: 5px 13px; border-radius: 99px;
    font-family: 'Nunito', sans-serif;
  }

  /* tagline */
  .lu-tagline {
    font-size: 15px; font-weight: 400; line-height: 1.75;
    max-width: 280px;
    margin-bottom: 28px;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s;
  }
  .lu-tagline.vis { opacity: 1; transform: translateY(0); }

  /* CTA */
  .lu-cta {
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #ff6482 0%, #ff9472 100%);
    border: none; border-radius: 99px;
    padding: 14px 44px;
    cursor: pointer;
    box-shadow: 0 8px 22px rgba(255,100,130,0.32);
    opacity: 0; transform: translateY(8px) scale(0.96);
    transition:
      opacity 0.5s ease 0.78s,
      transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.78s,
      box-shadow 0.2s, scale 0.15s;
    letter-spacing: 0.2px;
    margin-bottom: 8px;
  }
  .lu-cta.vis { opacity: 1; transform: translateY(0) scale(1); }
  .lu-cta:hover { box-shadow: 0 12px 30px rgba(255,100,130,0.42); scale: 1.04; }
  .lu-cta:active { scale: 0.97; }

  /* ---------- DIVIDER ---------- */
  .lu-divider {
    width: 100%; height: 1px;
    margin: 32px 0;
    opacity: 0;
    transition: opacity 0.6s ease 1s;
  }
  .lu-divider.vis { opacity: 1; }

  /* ---------- STATS ---------- */
  .lu-stats {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 32px;
    opacity: 0; transform: translateY(10px);
    transition: opacity 0.5s ease 1.05s, transform 0.5s ease 1.05s;
  }
  .lu-stats.vis { opacity: 1; transform: translateY(0); }

  .lu-stat {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 14px 8px;
    border-radius: 18px;
    font-family: 'Nunito', sans-serif;
  }
  .lu-stat-val {
    font-size: 22px; font-weight: 900;
    background: linear-gradient(135deg, #ff6482, #5b7cf6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .lu-stat-label { font-size: 11px; font-weight: 600; text-align: center; line-height: 1.4; }

  /* ---------- FEATURES ---------- */
  .lu-section-label {
    font-size: 10px; font-weight: 800; letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 12px;
    align-self: flex-start;
    opacity: 0;
    transition: opacity 0.5s ease 1.1s;
  }
  .lu-section-label.vis { opacity: 1; }

  .lu-features {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 32px;
  }

  @media (max-width: 380px) {
    .lu-features { grid-template-columns: 1fr; }
  }

  .lu-feature {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px;
    border-radius: 18px;
    border: 1.5px solid transparent;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.45s ease, transform 0.45s ease, border-color 0.2s;
  }
  .lu-feature.vis { opacity: 1; transform: translateY(0); }
  .lu-feature:not(.soon):hover { border-color: rgba(255,100,130,0.3); }
  .lu-feature.soon { opacity: 0.55 !important; }

  .lu-feat-icon {
    flex-shrink: 0;
    width: 36px; height: 36px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
  }

  .lu-feat-title {
    font-size: 13px; font-weight: 800;
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 2px;
  }
  .lu-feat-desc {
    font-size: 11.5px; font-weight: 400; line-height: 1.6;
  }

  .lu-soon-badge {
    font-size: 9px; font-weight: 800; letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 7px; border-radius: 99px;
  }

  /* ---------- FOOTER ---------- */
  .lu-footer {
    width: 100%; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding-top: 8px;
    opacity: 0;
    transition: opacity 0.5s ease 1.5s;
  }
  .lu-footer.vis { opacity: 1; }
  .lu-footer p { font-size: 13px; font-weight: 400; }
  .lu-footer span { font-size: 11px; }
`;

const features = [
  {
    icon: "💬",
    iconBg: "rgba(255,100,130,0.15)",
    label: "Real-time Messaging",
    desc: "Instant messages with everyone in your rooms.",
  },
  {
    icon: "🏠",
    iconBg: "rgba(91,124,246,0.15)",
    label: "Chat Rooms",
    desc: "Join topic rooms or create your own space.",
  },
  {
    icon: "🙋",
    iconBg: "rgba(255,100,130,0.15)",
    label: "Custom Profiles",
    desc: "Set your username, avatar, and vibe.",
  },
  {
    icon: "🤝",
    iconBg: "rgba(91,124,246,0.12)",
    label: "Friends List",
    desc: "Add friends and keep connections close.",
    soon: true,
  },
  {
    icon: "🟢",
    iconBg: "rgba(52,211,153,0.12)",
    label: "Online Presence",
    desc: "See who's active and never miss a chat.",
    soon: true,
  },
];

export default function Welcome() {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 60);
    return () => clearTimeout(t);
  }, []);

  const c = (base: string) => `${base}${vis ? " vis" : ""}`;

  return (
    <>
      <style>{styles}</style>

      <div className="lu-home h-full overflow-y-auto px-6 py-10 dark:text-slate-100 bg-zinc-100 dark:bg-slate-950 dark:bg-opacity-10 text-slate-800">


        <div className="lu-inner overflow-y-auto">

          {/* ── HERO ── */}
          <div className="lu-hero">
            <br />
            <div className={c("lu-wordmark")}>
              <span className="text-gray-900 dark:text-gray-100">Link</span>
              <span className="lu-word-up">Up</span>
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div
            className={c("lu-divider")}
            style={{
              background: "linear-gradient(to right, transparent, rgba(255,100,130,0.22), rgba(91,124,246,0.22), transparent)",
            }}
          />

          {/* ── FEATURES ── */}
          <p className={`${c("lu-section-label")} text-gray-400 dark:text-gray-600`}>
            What's inside
          </p>

          <div className="lu-features">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`lu-feature${f.soon ? " soon" : ""}${vis ? " vis" : ""} bg-gray-50 dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.05]`}
                style={{ transitionDelay: `${1.15 + i * 0.07}s` }}
              >
                <span className="lu-feat-icon" style={{ background: f.iconBg }}>
                  {f.icon}
                </span>
                <div>
                  <div className="lu-feat-title text-gray-800 dark:text-gray-100">
                    {f.label}
                    {f.soon && (
                      <span className="lu-soon-badge bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="lu-feat-desc text-gray-500 dark:text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}