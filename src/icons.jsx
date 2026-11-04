// Ícones SVG simples, desenhados à mão. Herdam a cor do texto (currentColor).

const PATHS = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  bolt: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.7" r="0.6" fill="currentColor" />
    </>
  ),
  tap: (
    <>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 10.5V9a1.5 1.5 0 0 1 3 0v2" />
      <path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4 15.6a1.5 1.5 0 0 1 2.3-1.9L9 16" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5" />
      <path d="M12 14v4M8 20.5h8" />
    </>
  ),
}

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}

export function SunHero() {
  const raios = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg className="hero hero-sol" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="g-sol" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff4b8" />
          <stop offset="55%" stopColor="#ffc93c" />
          <stop offset="100%" stopColor="#f08a1c" />
        </radialGradient>
      </defs>
      <g className="raios">
        {raios.map((a) => (
          <rect
            key={a}
            x="56"
            y="4"
            width="8"
            height="20"
            rx="4"
            fill="#7a2e00"
            transform={`rotate(${a} 60 60)`}
          />
        ))}
      </g>
      <circle cx="60" cy="60" r="30" fill="url(#g-sol)" stroke="#7a2e00" strokeWidth="4" />
    </svg>
  )
}

export function TrophyHero() {
  return (
    <svg className="hero" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="#fff8e6" stroke="#7a2e00" strokeWidth="4" />
      <g fill="#ffc93c" stroke="#7a2e00" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M40 30h40v18a20 20 0 0 1-40 0V30z" />
        <path d="M40 36H29v6a11 11 0 0 0 11 11M80 36h11v6a11 11 0 0 1-11 11" fill="none" />
        <path d="M54 67h12v12H54z" />
        <path d="M44 79h32v10H44z" />
      </g>
      <path d="M60 36l2.6 5.3 5.8.8-4.2 4.1 1 5.8L60 49.3 54.8 52l1-5.8-4.2-4.1 5.8-.8z" fill="#7a2e00" />
    </svg>
  )
}
