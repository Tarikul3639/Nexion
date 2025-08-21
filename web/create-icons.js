const fs = require('fs');
const path = require('path');

// Create a SVG icon with gradient background and BotMessageSquare icon
const createIcon = (size) => {
  const strokeWidth = size * 0.0625; // 2/32 ratio for stroke width
  const iconSize = size * 0.75; // 24/32 ratio for icon size
  const iconOffset = size * 0.125; // 4/32 ratio for icon offset
  const cornerRadius = size * 0.1875; // 6/32 ratio for corner radius
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
  <defs>
    <!-- Gradient for background -->
    <linearGradient id="grad${size}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#8e4ae8ff"/>
    </linearGradient>
  </defs>

  <!-- Rounded background -->
  <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="url(#grad${size})"/>

  <!-- BotMessageSquare icon (white) -->
  <g transform="translate(${iconOffset},${iconOffset})" fill="none" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M${iconSize * 0.5} ${iconSize * 0.25}V${iconSize * 0.0833}H${iconSize * 0.333}"/>
    <path d="M${iconSize * 0.625} ${iconSize * 0.458}v${iconSize * 0.083}"/>
    <path d="M${iconSize * 0.083} ${iconSize * 0.5}h${iconSize * 0.083}"/>
    <path d="M${iconSize * 0.833} ${iconSize * 0.5}h${iconSize * 0.083}"/>
    <path d="M${iconSize * 0.833} ${iconSize * 0.667}a${iconSize * 0.083} ${iconSize * 0.083} 0 0 1-${iconSize * 0.083} ${iconSize * 0.083}H${iconSize * 0.368}a${iconSize * 0.083} ${iconSize * 0.083} 0 0 0-${iconSize * 0.059} ${iconSize * 0.024}l-${iconSize * 0.092} ${iconSize * 0.092}A${iconSize * 0.0296} ${iconSize * 0.0296} 0 0 1 ${iconSize * 0.167} ${iconSize * 0.845}V${iconSize * 0.333}a${iconSize * 0.083} ${iconSize * 0.083} 0 0 1 ${iconSize * 0.083}-${iconSize * 0.083}h${iconSize * 0.5}a${iconSize * 0.083} ${iconSize * 0.083} 0 0 1 ${iconSize * 0.083} ${iconSize * 0.083}z"/>
    <path d="M${iconSize * 0.375} ${iconSize * 0.458}v${iconSize * 0.083}"/>
  </g>
</svg>`;
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create different sizes
const sizes = [48, 72, 96, 144, 192, 512];

sizes.forEach(size => {
  const svgContent = createIcon(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svgContent);
});

console.log('Icons created successfully!');
