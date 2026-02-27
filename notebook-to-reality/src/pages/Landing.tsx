import { ArrowRight, Activity, ShieldCheck, TrendingDown, Database, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/* ---------- inline keyframe styles ---------- */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

  .landing-root {
    font-family: 'Inter', sans-serif;
    background: #040d18;
    color: #e2e8f0;
    min-height: 100vh;
  }

  /* blob glows */
  .glow-orb-1 {
    position: absolute; top: -10%; left: -5%;
    width: 55%; height: 55%;
    background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);
    filter: blur(60px);
    animation: driftA 14s ease-in-out infinite alternate;
  }
  .glow-orb-2 {
    position: absolute; bottom: -15%; right: -5%;
    width: 60%; height: 60%;
    background: radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%);
    filter: blur(80px);
    animation: driftB 18s ease-in-out infinite alternate;
  }
  .glow-orb-3 {
    position: absolute; top: 40%; left: 30%;
    width: 35%; height: 35%;
    background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%);
    filter: blur(50px);
    animation: driftA 22s ease-in-out infinite alternate-reverse;
  }

  @keyframes driftA { from { transform: translate(0,0) scale(1); } to { transform: translate(5%,8%) scale(1.08); } }
  @keyframes driftB { from { transform: translate(0,0) scale(1); } to { transform: translate(-6%,-5%) scale(1.1); } }

  /* grid overlay */
  .dot-grid {
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(6,182,212,0.08) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 90% 90% at 50% 0%, black 30%, transparent 100%);
  }

  /* nav */
  .nav-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2rem;
    border-bottom: 1px solid rgba(6,182,212,0.12);
    background: rgba(4,13,24,0.7);
    backdrop-filter: blur(16px);
    position: sticky; top: 0; z-index: 50;
  }
  .nav-logo { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 1.25rem; letter-spacing: -0.03em; color: #fff; }
  .nav-logo svg { color: #06b6d4; }
  .nav-actions { display: flex; gap: 0.75rem; }
  .btn-ghost-nav {
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8; padding: 0.5rem 1.25rem; border-radius: 8px;
    font-size: 0.875rem; font-weight: 500; cursor: pointer; text-decoration: none;
    transition: all 0.2s;
  }
  .btn-ghost-nav:hover { border-color: rgba(6,182,212,0.4); color: #e2e8f0; }
  .btn-cta-nav {
    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
    color: #fff; border: none; padding: 0.5rem 1.25rem; border-radius: 8px;
    font-size: 0.875rem; font-weight: 600; cursor: pointer; text-decoration: none;
    box-shadow: 0 0 20px rgba(6,182,212,0.35);
    transition: all 0.2s;
  }
  .btn-cta-nav:hover { box-shadow: 0 0 30px rgba(6,182,212,0.55); transform: translateY(-1px); }

  /* hero layout */
  .hero-section {
    max-width: 1280px; margin: 0 auto;
    padding: 5rem 2rem 4rem;
    display: flex; align-items: center; gap: 4rem;
  }
  @media (max-width: 900px) { .hero-section { flex-direction: column; } }

  /* badge */
  .badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3);
    color: #06b6d4; border-radius: 999px; padding: 0.35rem 1rem;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #06b6d4; animation: pulse-dot 2s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.5); } }

  /* headline */
  .hero-headline {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 900; line-height: 1.05; letter-spacing: -0.04em;
    color: #fff; margin-bottom: 1.5rem;
  }
  .headline-gradient {
    background: linear-gradient(135deg, #06b6d4 0%, #818cf8 50%, #a78bfa 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    font-size: 1.125rem; color: #94a3b8; max-width: 520px; line-height: 1.75;
    margin-bottom: 2.5rem;
  }

  /* cta row */
  .cta-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem; }
  .btn-primary-hero {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, #06b6d4, #6366f1);
    color: #fff; border: none; padding: 0.9rem 2rem; border-radius: 12px;
    font-size: 1rem; font-weight: 700; cursor: pointer; text-decoration: none;
    box-shadow: 0 0 24px rgba(6,182,212,0.4), 0 4px 20px rgba(0,0,0,0.3);
    transition: all 0.25s; position: relative; overflow: hidden;
  }
  .btn-primary-hero::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-primary-hero:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(6,182,212,0.6), 0 8px 25px rgba(0,0,0,0.35); }
  .btn-primary-hero:hover::after { opacity: 1; }
  .btn-secondary-hero {
    display: inline-flex; align-items: center;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    color: #cbd5e1; padding: 0.9rem 2rem; border-radius: 12px;
    font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none;
    transition: all 0.25s; backdrop-filter: blur(10px);
  }
  .btn-secondary-hero:hover { background: rgba(255,255,255,0.09); border-color: rgba(6,182,212,0.3); color: #e2e8f0; transform: translateY(-1px); }

  /* stats row */
  .stats-row {
    display: flex; gap: 2.5rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap;
  }
  .stat-item { display: flex; flex-direction: column; gap: 0.3rem; }
  .stat-value { font-size: 2rem; font-weight: 900; color: #fff; letter-spacing: -0.03em; }
  .stat-value-cyan { color: #06b6d4; }
  .stat-value-purple { color: #a78bfa; }
  .stat-value-green { color: #34d399; }
  .stat-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }

  /* SVG panel */
  .svg-panel {
    flex: 1; min-width: 320px; max-width: 600px; position: relative;
    animation: fadeInRight 1s ease-out both;
  }
  @keyframes fadeInRight { from { opacity:0; transform: translateX(40px); } to { opacity:1; transform: translateX(0); } }

  /* SVG glow rings */
  .ring-glow { filter: drop-shadow(0 0 12px rgba(6,182,212,0.6)); }
  .ring-glow-purple { filter: drop-shadow(0 0 10px rgba(139,92,246,0.7)); }
  .ring-glow-green { filter: drop-shadow(0 0 10px rgba(52,211,153,0.7)); }

  /* orbit animation */
  @keyframes orbit { from { transform: rotate(0deg) translateX(90px) rotate(0deg); } to { transform: rotate(360deg) translateX(90px) rotate(-360deg); } }
  @keyframes orbit2 { from { transform: rotate(120deg) translateX(130px) rotate(-120deg); } to { transform: rotate(480deg) translateX(130px) rotate(-480deg); } }
  @keyframes orbit3 { from { transform: rotate(240deg) translateX(160px) rotate(-240deg); } to { transform: rotate(600deg) translateX(160px) rotate(-600deg); } }
  @keyframes pulse-ring { 0%,100% { opacity:0.3; r:70; } 50% { opacity:0.7; r:80; } }
  @keyframes draw-line { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
  @keyframes float-node { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

  /* features strip */
  .features-strip {
    background: rgba(255,255,255,0.02);
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 4rem 2rem;
  }
  .features-inner { max-width: 1280px; margin: 0 auto; }
  .features-title {
    text-align: center; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: #475569; margin-bottom: 2.5rem;
  }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }

  .feature-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 1.5rem;
    transition: all 0.3s;
    position: relative; overflow: hidden;
  }
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .feature-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(6,182,212,0.2); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
  .feature-card:hover::before { opacity: 1; }

  .feature-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem; font-size: 1.25rem;
  }
  .feature-icon-cyan { background: rgba(6,182,212,0.15); color: #06b6d4; box-shadow: 0 0 20px rgba(6,182,212,0.2); }
  .feature-icon-purple { background: rgba(139,92,246,0.15); color: #a78bfa; box-shadow: 0 0 20px rgba(139,92,246,0.2); }
  .feature-icon-green { background: rgba(52,211,153,0.15); color: #34d399; box-shadow: 0 0 20px rgba(52,211,153,0.2); }

  .feature-title { font-size: 1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.5rem; }
  .feature-desc { font-size: 0.875rem; color: #64748b; line-height: 1.65; }

  /* floating stat cards */
  .stat-card-float {
    position: absolute; background: rgba(4,13,24,0.85);
    border: 1px solid rgba(6,182,212,0.2); border-radius: 12px;
    padding: 0.75rem 1rem; backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .stat-card-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin-bottom: 0.1rem; }
  .stat-card-value { font-size: 1.1rem; font-weight: 800; color: #06b6d4; }
  .stat-card-sub { font-size: 0.65rem; color: #475569; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .hero-copy { animation: fadeUp 0.8s ease-out both; }
`;

export default function Landing() {
  return (
    <>
      <style>{styles}</style>
      <div className="landing-root">
        {/* Background layer */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div className="glow-orb-1" />
          <div className="glow-orb-2" />
          <div className="glow-orb-3" />
          <div className="dot-grid" />
        </div>

        {/* Nav */}
        <nav className="nav-bar" style={{ position: "relative", zIndex: 50 }}>
          <div className="nav-logo">
            <Activity size={22} />
            MediPredict
          </div>
          <div className="nav-actions">
            <Link to="/about" className="btn-ghost-nav">About App</Link>
            <Link to="/dashboard" className="btn-cta-nav">Try Prototype</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero-section" style={{ position: "relative", zIndex: 1 }}>
          {/* Left: Copy */}
          <div style={{ flex: "1.1" }} className="hero-copy">
            <div className="badge">
              <span className="badge-dot" />
              Now Live &mdash; Predictive Analytics v1.0
            </div>

            <h1 className="hero-headline">
              Predict Your<br />
              Insurance Cost<br />
              <span className="headline-gradient">Before It Hits.</span>
            </h1>

            <p className="hero-sub">
              A Random Forest ML engine that decodes the hidden signals in your demographics, habits, and location — delivering accurate premium estimates in under a second.
            </p>

            <div className="cta-row">
              <Link to="/dashboard" className="btn-primary-hero">
                Launch Dashboard <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary-hero">
                Explore Docs
              </Link>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-value stat-value-cyan">82.9%</span>
                <span className="stat-label">R² Accuracy Score</span>
              </div>
              <div className="stat-item">
                <span className="stat-value stat-value-purple">1.3k+</span>
                <span className="stat-label">Records Analyzed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value stat-value-green">&lt;1s</span>
                <span className="stat-label">Prediction Latency</span>
              </div>
            </div>
          </div>

          {/* Right: Animated SVG */}
          <div className="svg-panel">
            {/* Floating stat cards */}
            <div className="stat-card-float" style={{ top: "8%", left: "-5%", animation: "fadeUp 1.2s 0.3s ease-out both" }}>
              <div className="stat-card-label">Avg. Premium</div>
              <div className="stat-card-value">$13,311</div>
              <div className="stat-card-sub">across 1,207 clean records</div>
            </div>
            <div className="stat-card-float" style={{ bottom: "12%", right: "-5%", borderColor: "rgba(139,92,246,0.3)", animation: "fadeUp 1.2s 0.6s ease-out both" }}>
              <div className="stat-card-label">RMSE Error</div>
              <div className="stat-card-value" style={{ color: "#a78bfa" }}>$4,680</div>
              <div className="stat-card-sub">MAE: $2,875</div>
            </div>

            <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
              <defs>
                <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0a1929" />
                  <stop offset="100%" stopColor="#040d18" />
                </radialGradient>
                <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                </radialGradient>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                  <stop offset="30%" stopColor="#06b6d4" />
                  <stop offset="70%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <filter id="glow-cyan">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-purple">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Background circle */}
              <circle cx="250" cy="250" r="220" fill="url(#bgGrad)" />
              <circle cx="250" cy="250" r="220" fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth="1" />

              {/* Pulsing core */}
              <circle cx="250" cy="250" r="70" fill="url(#coreGrad)">
                <animate attributeName="r" values="70;80;70" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Orbit rings */}
              <circle cx="250" cy="250" r="100" fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="250" cy="250" r="145" fill="none" stroke="rgba(139,92,246,0.10)" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="250" cy="250" r="185" fill="none" stroke="rgba(52,211,153,0.08)" strokeWidth="1" strokeDasharray="3 10" />

              {/* Center node */}
              <circle cx="250" cy="250" r="28" fill="#040d18" stroke="#06b6d4" strokeWidth="2.5" filter="url(#glow-cyan)" />
              <circle cx="250" cy="250" r="14" fill="rgba(6,182,212,0.25)" />
              {/* Center icon bars */}
              <rect x="240" y="244" width="4" height="12" rx="2" fill="#06b6d4" />
              <rect x="247" y="240" width="4" height="16" rx="2" fill="#06b6d4" />
              <rect x="254" y="246" width="4" height="10" rx="2" fill="#06b6d4" />

              {/* Orbiting node 1 — Cyan */}
              <g style={{ transformOrigin: "250px 250px", animation: "orbit1 8s linear infinite" }}>
                <circle cx="250" cy="150" r="18" fill="#040d18" stroke="#06b6d4" strokeWidth="2" filter="url(#glow-cyan)" />
                <text x="250" y="155" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="700">R²</text>
              </g>

              {/* Orbiting node 2 — Purple */}
              <g style={{ transformOrigin: "250px 250px", animation: "orbit2 11s linear infinite" }}>
                <circle cx="250" cy="105" r="15" fill="#040d18" stroke="#a78bfa" strokeWidth="2" filter="url(#glow-purple)" />
                <text x="250" y="110" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="700">ML</text>
              </g>

              {/* Orbiting node 3 — Green */}
              <g style={{ transformOrigin: "250px 250px", animation: "orbit3 15s linear infinite" }}>
                <circle cx="250" cy="65" r="13" fill="#040d18" stroke="#34d399" strokeWidth="2" />
                <text x="250" y="70" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="700">AI</text>
              </g>

              {/* EKG / heartbeat line across center */}
              <polyline
                points="30,310 80,310 100,280 115,340 130,270 145,330 160,310 390,310 410,285 425,335 440,310 475,310"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="600"
                strokeDashoffset="600"
              >
                <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
              </polyline>

              {/* Mini bar chart bottom-right quadrant */}
              <g transform="translate(310, 295)">
                <rect x="0" y="30" width="10" height="30" rx="2" fill="rgba(6,182,212,0.4)" />
                <rect x="14" y="18" width="10" height="42" rx="2" fill="rgba(6,182,212,0.6)" />
                <rect x="28" y="8" width="10" height="52" rx="2" fill="#06b6d4" filter="url(#glow-cyan)" />
                <rect x="42" y="22" width="10" height="38" rx="2" fill="rgba(6,182,212,0.5)" />
              </g>

              {/* Data stream particles */}
              {[...Array(5)].map((_, i) => (
                <circle key={i} r="2.5" fill="#06b6d4" opacity="0.7">
                  <animateMotion
                    dur={`${3 + i * 0.8}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.6}s`}
                    path="M 250,150 C 320,150 370,200 370,250 C 370,320 320,370 250,370 C 180,370 130,320 130,250 C 130,180 180,130 250,130"
                  />
                </circle>
              ))}
              {[...Array(4)].map((_, i) => (
                <circle key={`p2-${i}`} r="2" fill="#a78bfa" opacity="0.6">
                  <animateMotion
                    dur={`${4 + i}s`}
                    repeatCount="indefinite"
                    begin={`${i * 1.1}s`}
                    path="M 250,105 C 360,110 400,210 390,280 C 375,355 310,400 250,400 C 185,400 115,360 105,280 C 92,195 145,115 250,105"
                  />
                </circle>
              ))}
            </svg>

            <style>{`
              @keyframes orbit1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes orbit2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
              @keyframes orbit3 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="features-strip" style={{ position: "relative", zIndex: 1 }}>
          <div className="features-inner">
            <p className="features-title">What the platform does</p>
            <div className="features-grid">
              <FeatureCard
                iconClass="feature-icon-cyan"
                icon={<Database size={20} />}
                title="Smart Data Pipeline"
                desc="Automatic ingestion, normalization, and cleaning of raw healthcare records — negative ages fixed, currency stripped, labels standardized."
              />
              <FeatureCard
                iconClass="feature-icon-purple"
                icon={<Zap size={20} />}
                title="Instant ML Prediction"
                desc="Enter any patient profile and get a precise insurance cost estimate in milliseconds — powered by a tuned Random Forest Regressor."
              />
              <FeatureCard
                iconClass="feature-icon-green"
                icon={<ShieldCheck size={20} />}
                title="Validated Accuracy"
                desc="Model benchmarked against a holdout dataset row by row. R² of 0.8299, RMSE $4,680, MAE $2,875 — transparently reported."
              />
              <FeatureCard
                iconClass="feature-icon-cyan"
                icon={<TrendingDown size={20} />}
                title="Risk Factor Explorer"
                desc="Interactive charts expose the real drivers — smoking, BMI, age group, region — so you understand exactly what pushes premiums up."
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function FeatureCard({ iconClass, icon, title, desc }: {
  iconClass: string; icon: React.ReactNode; title: string; desc: string;
}) {
  return (
    <div className="feature-card">
      <div className={`feature-icon ${iconClass}`}>{icon}</div>
      <div className="feature-title">{title}</div>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}
