import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const backgroundColor = '#7C3AED'; // Purple background
const iconColor = '#A5F3FC'; // Light cyan for the icon

async function generateIcons() {
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <g transform="translate(256, 256)">
        <circle r="120" 
                fill="none" 
                stroke="${iconColor}" 
                stroke-width="48"
                stroke-dasharray="60,40"/>
        <circle r="180" 
                fill="none" 
                stroke="${iconColor}" 
                stroke-width="48"
                stroke-dasharray="80,55"
                transform="rotate(45)"/>
      </g>
    </svg>
  `;

  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(join(__dirname, '..', 'public', `icon-${size}.png`));
  }

  // Generate a small version for the navbar
  await sharp(Buffer.from(svg))
    .resize(24, 24)
    .png()
    .toFile(join(__dirname, '..', 'public', 'navbar-icon.png'));
}

generateIcons().catch(console.error);
