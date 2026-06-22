import fs from 'fs';
import sharp from 'sharp';

// 2. Construct mathematically perfect and premium LIGHT SVG banner matching the website's design system
const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Background glows -->
    <radialGradient id="bg-glow-right" cx="80%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#5e5ce6" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#5e5ce6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bg-glow-left" cx="20%" cy="20%" r="45%">
      <stop offset="0%" stop-color="#5e5ce6" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#5e5ce6" stop-opacity="0" />
    </radialGradient>
    
    <!-- Premium card gradients -->
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#fdfdff" />
    </linearGradient>
    <linearGradient id="subcard-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <linearGradient id="inner-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    
    <!-- Shadow filters for SaaS mockup cards -->
    <filter id="shadow-main" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.06" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.02" />
    </filter>
    <filter id="shadow-sub" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.03" />
    </filter>
  </defs>

  <!-- Base background (Light Slate) -->
  <rect width="1200" height="630" fill="#f4f5fa" />

  <!-- Soft Glow effects -->
  <rect width="1200" height="630" fill="url(#bg-glow-left)" />
  <rect width="1200" height="630" fill="url(#bg-glow-right)" />

  <!-- Subtle grid overlay -->
  <g opacity="0.025" stroke="#000000" stroke-width="1">
    <!-- Vertical lines -->
    <line x1="100" y1="0" x2="100" y2="630" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="300" y1="0" x2="300" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="500" y1="0" x2="500" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="700" y1="0" x2="700" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="900" y1="0" x2="900" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
    <line x1="1100" y1="0" x2="1100" y2="630" />
    <!-- Horizontal lines -->
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="500" x2="1200" y2="500" />
    <line x1="0" y1="600" x2="1200" y2="600" />
  </g>

  <!-- Left Column: Branding -->
  <g transform="translate(80, 0)">
    <!-- Brand Logo: Blue Ring + "Fleetcodes" text in design system style -->
    <g transform="translate(0, 95)">
      <!-- Blue Ring Logo Icon -->
      <circle cx="24" cy="24" r="19" fill="none" stroke="#2466a0" stroke-width="10" />
      <!-- Brand Text next to symbol -->
      <text x="64" y="36" fill="#0f172a" font-size="38" font-weight="800" letter-spacing="-0.02em" font-family="System-UI, -apple-system, sans-serif">Fleetcodes</text>
    </g>

    <!-- Header Headline -->
    <text x="0" y="245" fill="#0f172a" font-size="54" font-weight="800" letter-spacing="-0.02em" line-height="1.2">
      <tspan x="0" dy="0">Automation-First</tspan>
      <tspan x="0" dy="65">TMS for Logistics</tspan>
    </text>

    <!-- Description Copy -->
    <text x="0" y="405" fill="#475569" font-size="20" font-weight="400" letter-spacing="0" line-height="1.65">
      <tspan x="0" dy="0">AI-powered TMS that learns your SOPs and runs</tspan>
      <tspan x="0" dy="32">your fleet operations autonomously. Cut costs,</tspan>
      <tspan x="0" dy="32">eliminate errors, and scale logistics headcount-free.</tspan>
    </text>

    <!-- Design System pill badges -->
    <g transform="translate(0, 505)">
      <rect width="160" height="38" rx="8" fill="#e0e7ff" stroke="#c7d2fe" stroke-width="1" />
      <text x="80" y="24" fill="#4338ca" font-size="13" font-weight="700" text-anchor="middle">SOP AUTOMATION</text>
      
      <rect x="175" width="165" height="38" rx="8" fill="#d1fae5" stroke="#a7f3d0" stroke-width="1" />
      <text x="257" y="24" fill="#047857" font-size="13" font-weight="700" text-anchor="middle">AUTO-DISPATCH</text>
    </g>
  </g>

  <!-- Right Column: Dashboard Mockup -->
  <g transform="translate(640, 85)" filter="url(#shadow-main)">
    <!-- Dashboard Card Frame -->
    <rect width="480" height="460" rx="20" fill="url(#card-grad)" stroke="#000000" stroke-opacity="0.06" stroke-width="1.5" />

    <!-- Window Header -->
    <circle cx="25" cy="22" r="6" fill="#ef4444" />
    <circle cx="43" cy="22" r="6" fill="#f59e0b" />
    <circle cx="61" cy="22" r="6" fill="#10b981" />
    <text x="240" y="26" fill="#64748b" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="0.05em">FLEETCODES AI DASHBOARD</text>
    <line x1="0" y1="45" x2="480" y2="45" stroke="#000000" stroke-opacity="0.05" stroke-width="1" />

    <!-- Mockup Inner Content: Sidebar -->
    <g transform="translate(0, 45)">
      <!-- Sidebar background line -->
      <line x1="55" y1="0" x2="55" y2="415" stroke="#000000" stroke-opacity="0.04" stroke-width="1" />
      
      <!-- Sidebar icons (simulated) -->
      <rect x="18" y="20" width="20" height="20" rx="5" fill="#5e5ce6" fill-opacity="0.1" />
      <rect x="23" y="25" width="10" height="10" rx="2" fill="#5e5ce6" />
      
      <circle cx="28" cy="70" r="8" fill="#64748b" fill-opacity="0.1" />
      <circle cx="28" cy="110" r="8" fill="#64748b" fill-opacity="0.1" />
      <circle cx="28" cy="150" r="8" fill="#64748b" fill-opacity="0.1" />
    </g>

    <!-- Mockup Inner Content: Cards -->
    <g transform="translate(70, 65)">
      <!-- Live Tracking Card -->
      <g filter="url(#shadow-sub)">
        <rect width="390" height="180" rx="14" fill="url(#inner-card-grad)" stroke="#000000" stroke-opacity="0.04" stroke-width="1" />
        <text x="18" y="24" fill="#0f172a" font-size="14" font-weight="700">Live Operations Tracker</text>
        
        <!-- Status Badge -->
        <rect x="300" y="11" width="75" height="20" rx="6" fill="#d1fae5" />
        <text x="337" y="25" fill="#065f46" font-size="10" font-weight="700" text-anchor="middle">IN TRANSIT</text>
        
        <!-- Map Graphic -->
        <rect x="18" y="42" width="354" height="120" rx="8" fill="#f8fafc" stroke="#000000" stroke-opacity="0.04" stroke-width="1" />
        
        <!-- Map Grid Lines -->
        <path d="M18 82 L372 82 M18 122 L372 122 M100 42 L100 162 M200 42 L200 162 M300 42 L300 162" stroke="#000000" stroke-opacity="0.015" stroke-width="1" />

        <!-- Route Line (Delhi to Mumbai) -->
        <!-- Dotted light route path -->
        <path d="M 45 125 Q 120 70, 200 115 T 320 85" fill="none" stroke="#5e5ce6" stroke-opacity="0.25" stroke-width="4" stroke-linecap="round" />
        <path d="M 45 125 Q 120 70, 200 115 T 320 85" fill="none" stroke="#5e5ce6" stroke-width="3" stroke-dasharray="6,4" stroke-linecap="round" />
        
        <!-- Origin dot -->
        <circle cx="45" cy="125" r="5" fill="#5e5ce6" />
        <circle cx="45" cy="125" r="10" fill="#5e5ce6" fill-opacity="0.2" />
        <text x="45" y="145" fill="#64748b" font-size="9" font-weight="700" text-anchor="middle">DELHI</text>

        <!-- Destination dot -->
        <circle cx="320" cy="85" r="5" fill="#10b981" />
        <circle cx="320" cy="85" r="10" fill="#10b981" fill-opacity="0.2" />
        <text x="320" y="105" fill="#64748b" font-size="9" font-weight="700" text-anchor="middle">MUMBAI</text>

        <!-- Vehicle Marker -->
        <g transform="translate(195, 110)">
          <circle cx="0" cy="0" r="7" fill="#ffffff" stroke="#5e5ce6" stroke-width="2" />
          <text x="14" y="3" fill="#0f172a" font-size="9" font-weight="700">MH-01-1234</text>
        </g>
      </g>
    </g>

    <!-- Bottom Left Grid: Stats -->
    <g transform="translate(70, 260)" filter="url(#shadow-sub)">
      <rect width="185" height="175" rx="14" fill="url(#inner-card-grad)" stroke="#000000" stroke-opacity="0.04" stroke-width="1" />
      <text x="18" y="26" fill="#64748b" font-size="12" font-weight="700" letter-spacing="0.02em">FLEET METRICS</text>
      
      <!-- Stat 1 -->
      <text x="18" y="68" fill="#0f172a" font-size="28" font-weight="800">128 / +5%</text>
      <text x="18" y="88" fill="#64748b" font-size="11" font-weight="600">Active Vehicles</text>

      <!-- Stat 2 -->
      <text x="18" y="132" fill="#0f766e" font-size="28" font-weight="800">98.2%</text>
      <text x="18" y="152" fill="#64748b" font-size="11" font-weight="600">On-Time Performance</text>
    </g>

    <!-- Bottom Right Grid: Automated Action Log -->
    <g transform="translate(275, 260)" filter="url(#shadow-sub)">
      <rect width="185" height="175" rx="14" fill="url(#inner-card-grad)" stroke="#000000" stroke-opacity="0.04" stroke-width="1" />
      <text x="18" y="26" fill="#64748b" font-size="12" font-weight="700" letter-spacing="0.02em">RECENT ACTIONS</text>

      <!-- Automation Item 1 -->
      <g transform="translate(18, 50)">
        <rect width="8" height="8" rx="2" y="3" fill="#5e5ce6" />
        <text x="16" y="11" fill="#0f172a" font-size="11" font-weight="700">Fuel Advance Auto-Paid</text>
        <text x="16" y="25" fill="#64748b" font-size="10" font-weight="500">Trip #1102 • Rajesh Kumar</text>
      </g>

      <!-- Automation Item 2 -->
      <g transform="translate(18, 105)">
        <rect width="8" height="8" rx="2" y="3" fill="#10b981" />
        <text x="16" y="11" fill="#0f172a" font-size="11" font-weight="700">Toll Refund Detected</text>
        <text x="16" y="25" fill="#64748b" font-size="10" font-weight="500">Fastag auto-reconciled</text>
      </g>
    </g>
  </g>
</svg>
`;

async function run() {
  try {
    const pngPath = 'public/new-og-image.png';
    await sharp(Buffer.from(svgString))
      .png()
      .toFile(pngPath);
    console.log('Successfully generated clean custom light-theme new-og-image.png using sharp!');
  } catch (err) {
    console.error('Error generating custom OG image:', err);
  }
}

run();
