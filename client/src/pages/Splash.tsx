import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .splash {
    min-height: 100vh;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    gap: 0;
  }

  /* floating blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(48px);
    opacity: 0;
    transition: opacity 1.4s ease 0.1s;
  }
  .blob.visible { opacity: 1; }

  /* logo bubble */
  .logo-wrap {
    opacity: 0;
    transform: translateY(-52px) scale(0.75);
    transition: opacity 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.1s,
                transform 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.1s;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }
  .logo-wrap.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .logo-bubble {
    width: 84px;
    height: 84px;
    border-radius: 28px;
    background: #ffffff;
    box-shadow: 0 8px 32px rgba(255,100,130,0.18), 0 2px 8px rgba(0,0,0,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* wordmark */
  .wordmark {
    font-family: 'Nunito', sans-serif;
    font-size: clamp(58px, 10vw, 90px);
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 0px;
    opacity: 0;
    transform: translateY(-38px);
    transition: opacity 0.6s cubic-bezier(0.34,1.46,0.64,1) 0.26s,
                transform 0.6s cubic-bezier(0.34,1.46,0.64,1) 0.26s;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }
  .wordmark.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .word-link { color: #1a1a2e; }

  .word-up {
    -webkit-text-stroke: 3px #ff6482;
    color: transparent;
    letter-spacing: -2px;
  }

  /* pill tags row */
  .pills {
    display: flex;
    gap: 8px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.55s ease 0.6s, transform 0.55s ease 0.6s;
    margin-bottom: 36px;
    position: relative;
    z-index: 1;
  }
  .pills.visible { opacity: 1; transform: translateY(0); }

  .pill {
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.3px;
    padding: 6px 14px;
    border-radius: 99px;
  }
  .pill-a { background: #fff0f3; color: #ff6482; }
  .pill-b { background: #f0f4ff; color: #5b7cf6; }
  .pill-c { background: #f0fdf6; color: #22c07a; }

  /* tagline */
  .tagline {
    font-family: 'Nunito', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #8b8b9e;
    text-align: center;
    line-height: 1.7;
    max-width: 260px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease 0.72s, transform 0.6s ease 0.72s;
    margin-bottom: 44px;
    position: relative;
    z-index: 1;
  }
  .tagline.visible { opacity: 1; transform: translateY(0); }

  /* CTA button */
  .enter-btn {
    font-family: 'Nunito', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(135deg, #ff6482 0%, #ff9472 100%);
    border: none;
    border-radius: 99px;
    padding: 16px 52px;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    box-shadow: 0 8px 24px rgba(255,100,130,0.35);
    transition:
      opacity 0.55s ease 0.95s,
      transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.95s,
      box-shadow 0.2s,
      scale 0.15s;
    position: relative;
    z-index: 1;
    letter-spacing: 0.2px;
  }
  .enter-btn.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .enter-btn:hover {
    box-shadow: 0 12px 32px rgba(255,100,130,0.45);
    scale: 1.05;
  }
  .enter-btn:active { scale: 0.97; }

  /* small avatar row hinting social */
  .avatars {
    display: flex;
    align-items: center;
    margin-top: 24px;
    opacity: 0;
    transition: opacity 0.5s ease 1.2s;
    position: relative;
    z-index: 1;
  }
  .avatars.visible { opacity: 1; }

  .av {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Nunito', sans-serif;
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    margin-left: -8px;
  }
  .av:first-child { margin-left: 0; }

  .av-label {
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #b0b0c0;
    margin-left: 10px;
  }
`;

const avatars = [
  { initials: "AK", bg: "#5b7cf6" },
  { initials: "JR", bg: "#22c07a" },
  { initials: "ML", bg: "#ff9472" },
  { initials: "DS", bg: "#a78bfa" },
];

export default function SplashScreenV3() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const cls = (base: string) => `${base}${visible ? " visible" : ""}`;

  return (
    <>
      <style>{styles}</style>
      <div className="splash">

        {/* logo */}
        <div className={cls("logo-wrap")}>
          <div className="logo-bubble">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              {/* speech bubble shape */}
              <rect x="4" y="6" width="30" height="22" rx="9" fill="#ff6482"/>
              <path d="M10 28 L7 36 L18 30" fill="#ff6482"/>
              {/* up arrow inside bubble */}
              <line x1="19" y1="21" x2="19" y2="11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
              <path d="M14.5 15 L19 10 L23.5 15" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              {/* second small bubble */}
              <circle cx="38" cy="34" r="7" fill="#5b7cf6"/>
              <line x1="38" y1="37.5" x2="38" y2="31.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M35.2 33.8 L38 31 L40.8 33.8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* wordmark */}
        <div className={cls("wordmark")}>
          <span className="word-link">Link</span>
          <span className="word-up">Up</span>
        </div>

        {/* pill tags */}
        <div className={cls("pills")}>
          <span className="pill pill-a">Messaging</span>
          <span className="pill pill-b">Groups</span>
          <span className="pill pill-c">Live</span>
        </div>

        {/* tagline */}
        <p className={cls("tagline")}>
          Chat with the people that matter.
          <br />
          Instantly, effortlessly.
        </p>

        {/* CTA */}
        <Link to="/home">
            <button className={cls("enter-btn")}>Get started</button>
        </Link>
      </div>
    </>
  );
}