// Gera docs/Loja-ED-Documentacao.pdf a partir de docs/Documentacao.md
// Pipeline: Markdown -> HTML (marked + highlight.js + mermaid) -> PDF (Edge/Chrome headless)
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { spawnSync } from 'child_process';
import { marked } from 'marked';
import hljs from 'highlight.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const docs = path.resolve(here, '..');
const md = fs.readFileSync(path.join(docs, 'Documentacao.md'), 'utf8');
const hlCss = fs.readFileSync(path.join(here, 'node_modules/highlight.js/styles/github.css'), 'utf8');
const mermaidUrl = pathToFileURL(path.join(here, 'node_modules/mermaid/dist/mermaid.min.js')).href;

const slug = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const toc = [];
const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => {
  const id = slug(raw);
  if (level === 2 || level === 3) toc.push({ level, id, text: raw.replace(/`/g, '') });
  return `<h${level} id="${id}">${text}</h${level}>\n`;
};
renderer.code = (code, info) => {
  const lang = (info || '').trim();
  if (lang === 'mermaid') return `<pre class="mermaid">${code}</pre>`;
  const l = hljs.getLanguage(lang) ? lang : 'plaintext';
  const html = hljs.highlight(code, { language: l }).value;
  return `<pre class="code"><span class="lang">${lang || 'texto'}</span><code class="hljs">${html}</code></pre>`;
};
marked.use({ renderer, gfm: true });
const body = marked.parse(md);

const tocHtml = toc
  .map((t) => `<li class="l${t.level}"><a href="#${t.id}">${t.text}</a></li>`)
  .join('\n');

const css = `
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Inter, Arial, sans-serif; color: #0F172A; font-size: 10.5pt; line-height: 1.5; }
h1,h2,h3 { color: #1E1B4B; line-height: 1.25; }
h2 { font-size: 18pt; border-bottom: 2px solid #4F46E5; padding-bottom: 4px; margin-top: 0; page-break-before: always; }
h3 { font-size: 13pt; margin-top: 22px; color: #4338CA; }
h4 { font-size: 11pt; margin: 16px 0 6px; }
a { color: #4F46E5; text-decoration: none; }
table { border-collapse: collapse; width: 100%; margin: 10px 0 16px; font-size: 9pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th { background: #4F46E5; color: #fff; text-align: left; padding: 6px 8px; }
td { border-bottom: 1px solid #E2E8F0; padding: 5px 8px; vertical-align: top; }
tbody tr:nth-child(even) td { background: #F8FAFC; }
code { font-family: Consolas, 'Courier New', monospace; font-size: 9pt; background: #EEF2FF; padding: 1px 4px; border-radius: 4px; }
pre.code { position: relative; background: #F6F8FA; border: 1px solid #E2E8F0; border-left: 4px solid #4F46E5; border-radius: 6px; padding: 10px 12px; margin: 10px 0 14px; white-space: pre-wrap; word-break: break-word; page-break-inside: avoid; }
pre.code code { background: none; padding: 0; font-size: 8.5pt; line-height: 1.45; }
pre.code .lang { position: absolute; top: 2px; right: 8px; font-size: 7pt; text-transform: uppercase; color: #64748B; }
pre.mermaid { text-align: center; page-break-inside: avoid; }
blockquote { border-left: 4px solid #F59E0B; background: #FFFBEB; margin: 10px 0; padding: 6px 12px; }
.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 10px 0 16px; }
.gallery figure { margin: 0; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; }
.gallery img { width: 100%; height: 110px; object-fit: cover; display: block; }
.gallery figcaption { font-size: 8pt; text-align: center; padding: 3px; color: #64748B; }
.cover { height: 255mm; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding-left: 12mm; border-left: 10px solid #4F46E5; }
.cover .tag { color: #4F46E5; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: 11pt; }
.cover h1 { font-size: 40pt; margin: 8px 0; }
.cover h2 { all: unset; display: block; font-size: 16pt; color: #475569; margin-bottom: 40px; }
.cover table { width: auto; font-size: 11pt; }
.cover td { border: none; padding: 3px 18px 3px 0; background: none !important; }
.toc-page { page-break-before: always; }
.toc-page h2 { page-break-before: avoid; }
.toc { list-style: none; padding: 0; }
.toc li { padding: 3px 0; }
.toc li.l2 { font-weight: 700; margin-top: 8px; font-size: 11.5pt; }
.toc li.l3 { margin-left: 22px; font-size: 10pt; }
`;

const today = new Date().toLocaleDateString('pt-BR');
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Loja ED — Documentação</title>
<style>${hlCss}</style><style>${css}</style></head><body>
<section class="cover">
  <div class="tag">Projeto Acadêmico · Full-Stack</div>
  <h1>Loja ED</h1>
  <h2>E-commerce de Eletrônicos — Especificação de UX, Histórias de Usuário, Curadoria de Imagens e Manual de Execução</h2>
  <table>
    <tr><td><b>Stack</b></td><td>Java / Spring Boot 3 · JWT · React 18 · Vite · TypeScript · Tailwind CSS</td></tr>
    <tr><td><b>Banco de dados</b></td><td>H2 (em memória)</td></tr>
    <tr><td><b>Credenciais</b></td><td>admin@ecommerce.com / admin123 · user@ecommerce.com / user123</td></tr>
    <tr><td><b>Data</b></td><td>${today}</td></tr>
  </table>
</section>
<section class="toc-page"><h2>Sumário</h2><ul class="toc">${tocHtml}</ul></section>
${body}
<script src="${mermaidUrl}"></script>
<script>mermaid.initialize({ startOnLoad: true, theme: 'neutral', flowchart: { useMaxWidth: true } });</script>
</body></html>`;

const htmlPath = path.join(here, 'Documentacao.html');
fs.writeFileSync(htmlPath, html);

const browsers = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];
const browser = browsers.find((b) => fs.existsSync(b));
if (!browser) throw new Error('Edge/Chrome não encontrado');
const pdf = path.join(docs, 'Loja-ED-Documentacao.pdf');
const r = spawnSync(browser, [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files',
  '--virtual-time-budget=20000', `--print-to-pdf=${pdf}`, pathToFileURL(htmlPath).href,
], { stdio: 'inherit' });
console.log('PDF:', pdf, fs.existsSync(pdf) ? fs.statSync(pdf).size + ' bytes' : 'NÃO GERADO', 'status', r.status);
