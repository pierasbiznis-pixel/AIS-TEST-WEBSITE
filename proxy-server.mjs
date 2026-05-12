import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;
const mime = { '.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml' };

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const scrollY = url.searchParams.get('scrollY') || 0;
  let path = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = join(__dirname, path);
  try {
    let data = await readFile(file);
    const ext = extname(file).toLowerCase();
    if (ext === '.html') {
      let html = data.toString();
      html = html.replace('</body>', `<script>window.addEventListener('load',()=>{window.scrollTo(0,${scrollY});});</script></body>`);
      res.writeHead(200, {'Content-Type':'text/html'}); res.end(html);
    } else {
      res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream'}); res.end(data);
    }
  } catch { res.writeHead(404); res.end('not found'); }
});

server.listen(PORT, () => { console.log('proxy ready'); });
setTimeout(() => { server.close(); process.exit(0); }, 60000);
