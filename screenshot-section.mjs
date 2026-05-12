import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scrollY = process.argv[2] || 0;
const label   = process.argv[3] || scrollY;

// Read the original HTML and inject scrollTo
let html = readFileSync(join(__dirname, 'index.html'), 'utf8');
html = html.replace('</body>', `<script>window.scrollTo(0,${scrollY});</script></body>`);

const tmpPath = join(__dirname, `.scroll-tmp-${label}.html`);
writeFileSync(tmpPath, html);

const outDir = join(__dirname, 'temporary screenshots');
const outFile = join(outDir, `screenshot-s${label}.png`);

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const { spawnSync } = await import('child_process');

// Use file:// URL for the temp file  
const fileUrl = 'file:///' + tmpPath.replace(/\\/g, '/');

const r = spawnSync(edge, [
  '--headless=new','--no-sandbox','--disable-gpu',
  '--disable-web-security',
  '--allow-file-access-from-files',
  `--screenshot=${outFile}`,
  '--window-size=1400,900',
  `--user-data-dir=${__dirname}\\.sp-${label}`,
  fileUrl,
], { stdio:'inherit' });

import { unlinkSync } from 'fs';
try { unlinkSync(tmpPath); } catch {}
console.log('exit', r.status, 'file:', outFile);
