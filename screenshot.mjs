import { execSync, spawn } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const outDir = join(__dirname, 'temporary screenshots');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Find next N
const existing = readdirSync(outDir).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0'));
const next = (nums.length ? Math.max(...nums) : 0) + 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath  = join(outDir, filename);

// Try puppeteer first
const puppeteerDirs = [
  'C:/Users/nateh/AppData/Local/Temp/puppeteer-test',
  join(__dirname, 'node_modules/.bin'),
];

// Use Edge/Chrome headless as fallback
const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

let browserPath = null;
for (const p of edgePaths) {
  if (existsSync(p)) { browserPath = p; break; }
}

if (!browserPath) {
  console.error('No browser found for screenshot');
  process.exit(1);
}

const tmpProfile = join(__dirname, '.screenshot-profile');
const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  `--screenshot=${outPath}`,
  '--window-size=1400,900',
  `--user-data-dir=${tmpProfile}`,
  url,
];

console.log(`Taking screenshot → ${filename}`);
const proc = spawn(browserPath, args, { stdio: 'inherit' });
proc.on('close', code => {
  if (existsSync(outPath)) {
    console.log(`Saved: temporary screenshots/${filename}`);
  } else {
    console.error('Screenshot file not created');
    process.exit(1);
  }
});
