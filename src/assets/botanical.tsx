export function BotanicalCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Main stem curving from top-right down */}
      <path
        d="M400 0 C390 40 370 80 350 120 C325 170 300 210 275 260 C255 300 240 350 225 400 C215 435 208 470 200 510"
        stroke="#3a4a31" strokeWidth="1.2" fill="none" opacity="0.5"
      />
      {/* Secondary stem branching left */}
      <path
        d="M350 120 C330 105 305 95 280 85 C260 77 240 72 215 68"
        stroke="#3a4a31" strokeWidth="0.9" fill="none" opacity="0.4"
      />

      {/* Large hibiscus bloom — top right */}
      <g transform="translate(310, 60)" opacity="0.85">
        {/* 5 organic petals */}
        <path d="M0,0 C-8,-30 -25,-55 -10,-75 C5,-95 20,-70 18,-45 C16,-20 8,-8 0,0" stroke="#3a4a31" strokeWidth="1.1" fill="#3a4a31" fillOpacity="0.08"/>
        <path d="M0,0 C20,-25 48,-35 58,-18 C68,-1 48,15 28,12 C12,10 4,6 0,0" stroke="#3a4a31" strokeWidth="1.1" fill="#3a4a31" fillOpacity="0.08"/>
        <path d="M0,0 C18,18 22,45 8,55 C-8,66 -22,48 -18,28 C-14,12 -6,4 0,0" stroke="#3a4a31" strokeWidth="1.1" fill="#3a4a31" fillOpacity="0.08"/>
        <path d="M0,0 C-20,15 -48,18 -55,4 C-62,-12 -45,-26 -28,-20 C-14,-15 -5,-5 0,0" stroke="#3a4a31" strokeWidth="1.1" fill="#3a4a31" fillOpacity="0.08"/>
        <path d="M0,0 C-15,-20 -15,-48 0,-55 C15,-62 28,-42 22,-25 C16,-10 6,-3 0,0" stroke="#3a4a31" strokeWidth="1.1" fill="#3a4a31" fillOpacity="0.08"/>
        {/* Stamens */}
        <line x1="0" y1="0" x2="0" y2="-18" stroke="#3a4a31" strokeWidth="0.7" opacity="0.8"/>
        <line x1="0" y1="0" x2="10" y2="-15" stroke="#3a4a31" strokeWidth="0.7" opacity="0.8"/>
        <line x1="0" y1="0" x2="-10" y2="-15" stroke="#3a4a31" strokeWidth="0.7" opacity="0.8"/>
        <circle cx="0" cy="-18" r="2" fill="#3a4a31" opacity="0.7"/>
        <circle cx="10" cy="-15" r="2" fill="#3a4a31" opacity="0.7"/>
        <circle cx="-10" cy="-15" r="2" fill="#3a4a31" opacity="0.7"/>
        <circle cx="0" cy="0" r="5" fill="#3a4a31" fillOpacity="0.3" stroke="#3a4a31" strokeWidth="0.8"/>
      </g>

      {/* Medium bloom — mid right */}
      <g transform="translate(375, 195)" opacity="0.72">
        <path d="M0,0 C-6,-22 -18,-40 -6,-55 C6,-70 18,-48 15,-30 C12,-14 5,-5 0,0" stroke="#3a4a31" strokeWidth="1" fill="#3a4a31" fillOpacity="0.07"/>
        <path d="M0,0 C16,-18 38,-24 44,-10 C50,4 35,16 20,12 C8,8 2,4 0,0" stroke="#3a4a31" strokeWidth="1" fill="#3a4a31" fillOpacity="0.07"/>
        <path d="M0,0 C14,14 16,36 4,44 C-8,52 -20,36 -14,20 C-10,8 -4,2 0,0" stroke="#3a4a31" strokeWidth="1" fill="#3a4a31" fillOpacity="0.07"/>
        <path d="M0,0 C-16,10 -38,10 -42,-4 C-46,-18 -30,-28 -18,-20 C-8,-14 -2,-5 0,0" stroke="#3a4a31" strokeWidth="1" fill="#3a4a31" fillOpacity="0.07"/>
        <path d="M0,0 C-10,-16 -8,-38 4,-44 C16,-50 26,-32 18,-16 C12,-4 4,0 0,0" stroke="#3a4a31" strokeWidth="1" fill="#3a4a31" fillOpacity="0.07"/>
        <circle cx="0" cy="0" r="4" fill="#3a4a31" fillOpacity="0.25" stroke="#3a4a31" strokeWidth="0.7"/>
        <line x1="0" y1="0" x2="0" y2="-12" stroke="#3a4a31" strokeWidth="0.6" opacity="0.7"/>
        <circle cx="0" cy="-12" r="1.5" fill="#3a4a31" opacity="0.6"/>
      </g>

      {/* Small bud top-left of main bloom */}
      <g transform="translate(255, 45)" opacity="0.6">
        <path d="M0,0 C-4,-14 -10,-24 -4,-32 C2,-40 10,-28 8,-18 C6,-8 2,-3 0,0" stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.06"/>
        <path d="M0,0 C8,-10 20,-12 22,-4 C24,4 16,10 8,6 C2,3 0,1 0,0" stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.06"/>
        <path d="M0,0 C8,6 10,18 4,22 C-2,26 -10,18 -6,8 C-4,2 -1,0 0,0" stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.06"/>
        <circle cx="0" cy="0" r="3" fill="#3a4a31" fillOpacity="0.2" stroke="#3a4a31" strokeWidth="0.6"/>
      </g>

      {/* Large leaf sweeping left from top bloom */}
      <path
        d="M295,85 C270,100 240,125 210,155 C195,170 185,185 178,200"
        stroke="#3a4a31" strokeWidth="1" fill="none" opacity="0.55"
      />
      <path
        d="M295,85 C275,92 255,110 240,135 C230,152 225,170 222,190"
        stroke="#3a4a31" strokeWidth="0.6" strokeDasharray="2,3" fill="none" opacity="0.35"
      />
      {/* Leaf blade */}
      <path
        d="M295,85 C260,90 230,120 215,155 C208,172 210,188 215,200 C235,180 265,148 280,118 C292,95 295,85 295,85Z"
        stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.05" opacity="0.7"
      />

      {/* Leaf from mid bloom */}
      <path
        d="M365,215 C340,230 315,255 290,285 C276,302 265,320 255,340"
        stroke="#3a4a31" strokeWidth="1" fill="none" opacity="0.5"
      />
      <path
        d="M365,215 C345,218 320,240 300,270 C285,295 278,318 272,342 C295,320 325,292 345,262 C360,238 367,218 365,215Z"
        stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.05" opacity="0.65"
      />

      {/* Lower dangling leaf */}
      <path
        d="M295,268 C275,295 260,325 248,360 C240,382 236,405 232,428"
        stroke="#3a4a31" strokeWidth="0.9" fill="none" opacity="0.45"
      />
      <path
        d="M295,268 C278,285 265,315 255,350 C248,375 244,400 240,425 C258,405 275,375 285,345 C295,315 298,285 295,268Z"
        stroke="#3a4a31" strokeWidth="0.8" fill="#3a4a31" fillOpacity="0.04" opacity="0.6"
      />

      {/* Small lower bloom */}
      <g transform="translate(345, 360)" opacity="0.6">
        <path d="M0,0 C-5,-18 -14,-32 -5,-44 C4,-56 16,-38 13,-24 C10,-12 4,-4 0,0" stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.07"/>
        <path d="M0,0 C12,-14 30,-18 34,-6 C38,6 26,16 14,10 C5,6 1,2 0,0" stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.07"/>
        <path d="M0,0 C12,10 14,28 3,35 C-8,42 -18,28 -12,14 C-8,5 -3,1 0,0" stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.07"/>
        <path d="M0,0 C-14,8 -30,6 -32,-6 C-34,-18 -20,-26 -10,-18 C-4,-12 -1,-4 0,0" stroke="#3a4a31" strokeWidth="0.9" fill="#3a4a31" fillOpacity="0.07"/>
        <circle cx="0" cy="0" r="4" fill="#3a4a31" fillOpacity="0.2" stroke="#3a4a31" strokeWidth="0.7"/>
      </g>

      {/* Berry clusters */}
      <g fill="#3a4a31" opacity="0.45">
        {/* Near top secondary branch */}
        <circle cx="262" cy="72" r="3"/>
        <circle cx="255" cy="80" r="2.2"/>
        <circle cx="270" cy="78" r="2"/>
        {/* Mid stem */}
        <circle cx="282" cy="195" r="2.5"/>
        <circle cx="275" cy="204" r="1.8"/>
        {/* Lower stem */}
        <circle cx="258" cy="318" r="2.5"/>
        <circle cx="250" cy="326" r="1.8"/>
        <circle cx="264" cy="325" r="1.5"/>
      </g>

      {/* Thin tendrils */}
      <g stroke="#3a4a31" strokeWidth="0.6" fill="none" opacity="0.3">
        <path d="M330,145 C318,158 308,175 312,190"/>
        <path d="M290,228 C278,248 272,268 276,285"/>
        <path d="M272,370 C262,388 256,408 260,425"/>
      </g>

      {/* Leaf veins on main leaf */}
      <g stroke="#3a4a31" strokeWidth="0.5" fill="none" opacity="0.25">
        <path d="M265,108 C258,120 252,132 248,145"/>
        <path d="M275,115 C265,128 258,142 254,156"/>
      </g>
    </svg>
  )
}

export function BotanicalDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="0" y1="15" x2="75" y2="15" stroke="#3a4a31" strokeWidth="0.5" opacity="0.5"/>
      {/* Small center sprig */}
      <path d="M90 20 C92 15 96 10 100 8 C104 10 108 15 110 20" stroke="#3a4a31" strokeWidth="0.8" fill="none" opacity="0.7"/>
      <path d="M100 8 L100 15" stroke="#3a4a31" strokeWidth="0.7" opacity="0.6"/>
      <circle cx="100" cy="7" r="2" fill="#3a4a31" opacity="0.5"/>
      <circle cx="90" cy="20" r="1.5" fill="#3a4a31" opacity="0.35"/>
      <circle cx="110" cy="20" r="1.5" fill="#3a4a31" opacity="0.35"/>
      <line x1="125" y1="15" x2="200" y2="15" stroke="#3a4a31" strokeWidth="0.5" opacity="0.5"/>
    </svg>
  )
}
