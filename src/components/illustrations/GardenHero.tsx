export function GardenHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* soft backdrop blob */}
      <path
        d="M320 30c110 0 210 55 250 150 35 84 10 190-70 240-90 57-210 55-300 5C105 380 40 300 45 205 51 100 175 30 320 30Z"
        fill="#fdf0e2"
      />

      {/* sun */}
      <g stroke="#e0a83e" strokeWidth="6" strokeLinecap="round">
        <line x1="486" y1="70" x2="486" y2="46" />
        <line x1="486" y1="70" x2="510" y2="30" />
        <line x1="486" y1="70" x2="464" y2="32" />
        <line x1="510" y1="90" x2="534" y2="80" />
        <line x1="462" y1="90" x2="438" y2="82" />
      </g>
      <circle cx="486" cy="96" r="34" fill="#e0a83e" />

      {/* birds */}
      <path d="M120 90q10-12 20 0q10-12 20 0" stroke="#9c4520" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M170 60q8-10 16 0q8-10 16 0" stroke="#9c4520" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* hill / soil line */}
      <path
        d="M0 340c60-24 120-30 180-18s110 36 170 32 130-40 190-30 90 34 100 30v126H0Z"
        fill="#8a9a56"
      />
      <path
        d="M0 356c60-20 120-24 180-14s110 30 170 26 130-32 190-24 90 26 100 22v108H0Z"
        fill="#6b7a3f"
      />

      {/* leafy greens rosette */}
      <g transform="translate(90 300)">
        <ellipse cx="0" cy="0" rx="34" ry="20" fill="#6b7a3f" transform="rotate(-20)" />
        <ellipse cx="18" cy="-8" rx="30" ry="18" fill="#7f9048" transform="rotate(15)" />
        <ellipse cx="-16" cy="-10" rx="28" ry="16" fill="#586b30" transform="rotate(-55)" />
        <ellipse cx="2" cy="-22" rx="24" ry="14" fill="#8a9a56" transform="rotate(2)" />
      </g>

      {/* carrots peeking from the soil */}
      <g transform="translate(230 330)">
        <path d="M-2 -6 L14 40 L4 44 L-10 -4Z" fill="#c05a2c" />
        <path d="M-2 -8q-4-14 -16-16q6 10 12 18Z" fill="#6b7a3f" />
        <path d="M2 -8q4-16 18-18q-8 12-14 20Z" fill="#7f9048" />
        <path d="M0 -10q0-14 2-20q3 12 2 22Z" fill="#586b30" />
      </g>
      <g transform="translate(268 336) scale(0.85)">
        <path d="M-2 -6 L14 40 L4 44 L-10 -4Z" fill="#9c4520" />
        <path d="M-2 -8q-4-14 -16-16q6 10 12 18Z" fill="#7f9048" />
        <path d="M2 -8q4-16 18-18q-8 12-14 20Z" fill="#586b30" />
      </g>

      {/* tomato vine */}
      <g transform="translate(400 260)">
        <path d="M0 100C-4 60 6 30 0 0" stroke="#586b30" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="-16" cy="30" rx="18" ry="10" fill="#7f9048" transform="rotate(-25 -16 30)" />
        <ellipse cx="18" cy="55" rx="18" ry="10" fill="#6b7a3f" transform="rotate(20 18 55)" />
        <ellipse cx="-14" cy="80" rx="16" ry="9" fill="#7f9048" transform="rotate(-15 -14 80)" />
        <circle cx="4" cy="18" r="13" fill="#c05a2c" />
        <circle cx="-10" cy="46" r="10" fill="#9c4520" />
        <circle cx="10" cy="66" r="11" fill="#c05a2c" />
        <path d="M4 5l-4 6h8Z" fill="#586b30" />
      </g>

      {/* harvest basket */}
      <g transform="translate(310 400)">
        <path d="M0 20 L120 20 L104 90 L16 90Z" fill="#c9975f" />
        <path
          d="M0 20 L120 20 L104 90 L16 90Z"
          fill="none"
          stroke="#9c6a3a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {[32, 46, 60, 74].map((y) => (
          <line key={y} x1={4 + (y - 20) * 0.1} y1={y} x2={116 - (y - 20) * 0.13} y2={y} stroke="#9c6a3a" strokeWidth="2.5" />
        ))}
        <path d="M14 22C24 -6 96 -6 106 22" stroke="#9c6a3a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="10" r="16" fill="#c05a2c" />
        <circle cx="70" cy="4" r="13" fill="#9c4520" />
        <ellipse cx="56" cy="-8" rx="16" ry="9" fill="#7f9048" transform="rotate(-10 56 -8)" />
      </g>
    </svg>
  );
}
