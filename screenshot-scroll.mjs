import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';

const scrollY = process.argv[2] || 0;
const label   = process.argv[3] || scrollY;
const outDir  = 'C:/Users/rasym/OneDrive/Desktop/claude/sessions/temporary screenshots';
const outFile = `${outDir}/screenshot-scroll-${label}.png`;

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

// Create temp html that scrolls
const tmpHtml = `C:/Users/rasym/AppData/Local/Temp/aiketra-shot.html`;
writeFileSync(tmpHtml, `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{overflow:hidden}iframe{border:none;width:1400px;height:900px;}</style></head><body><iframe src="http://localhost:3000" onload="this.contentWindow.scrollTo(0,${scrollY})"></iframe></body></html>`);

const { spawnSync } = await import('child_process');
const r = spawnSync(edge, [
  '--headless=new','--no-sandbox','--disable-gpu',
  `--screenshot=${outFile}`,
  '--window-size=1400,900',
  '--user-data-dir=C:/Users/rasym/AppData/Local/Temp/aiketra-profile',
  `file:///${tmpHtml.replace(/\//g,'/') }`,
], { stdio:'inherit' });
console.log('exit', r.status);
