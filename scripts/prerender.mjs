/* global process, console */
import { build } from 'vite';
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const temporary = path.join(root, 'dist', '.ssr');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
// Last commit date of the released source; falls back to the build date outside a Git checkout.
function releaseDate() {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs'], { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

// Sitemap and llms.txt list only indexable routes and reuse the published titles and descriptions.
async function writeSearchDocuments({ pageMetadata, indexableRoutes, siteUrl }) {
  const lastmod = releaseDate();
  const alternates = route => ['it', 'en', 'x-default'].map(locale => `<xhtml:link rel="alternate" hreflang="${locale}" href="${escape(siteUrl(route, locale === 'en' ? 'en' : 'it'))}" />`).join('');
  const entries = indexableRoutes.flatMap(route => ['it', 'en'].map(language => `  <url><loc>${escape(siteUrl(route, language))}</loc><lastmod>${lastmod}</lastmod>${alternates(route)}</url>`));
  await writeFile(path.join(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
  const home = pageMetadata('/', 'it');
  const pages = language => indexableRoutes.map(route => {
    const meta = pageMetadata(route, language);
    return `- [${meta.title}](${siteUrl(route, language)}): ${meta.description}`;
  }).join('\n');
  await writeFile(path.join(root, 'dist/llms.txt'), `# DeliR\n\n> ${home.description}\n\n## Italiano\n\n${pages('it')}\n\n## English\n\n${pages('en')}\n`);
}

try {
  await build({ configLoader: 'runner', build: { ssr: 'src/entry-prerender.tsx', outDir: temporary, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'entry.mjs' } } } });
  const { renderPage, pageMetadata, siteRoutes, indexableRoutes, siteUrl, structuredData } = await import(pathToFileURL(path.join(temporary, 'entry.mjs')).href);
  const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  await mkdir(path.join(root, 'dist/seo'), { recursive: true });
  const styles = (await readdir(path.join(root, 'dist/assets'))).filter(file => file.endsWith('.css') && !template.includes(`/assets/${file}`)).map(file => `<link rel="stylesheet" href="/assets/${file}" />`).join('\n');
  const staticStyles = new Map();
  for (const route of [...siteRoutes, '/404']) {
    for (const language of ['it', 'en']) {
      const meta = pageMetadata(route, language);
      let html = template.replace('<html lang="it">', `<html lang="${language}">`)
        .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
        .replace(/<div id="root"><\/div>/, () => `<div id="root">${renderPage(route, language)}</div>`);
      for (const [name, value] of Object.entries({ description: meta.description, robots: meta.robots, 'og:title': meta.title, 'og:description': meta.description, 'og:url': meta.canonical || 'https://delir.it/', 'og:locale': language === 'it' ? 'it_IT' : 'en_US', 'og:locale:alternate': language === 'it' ? 'en_US' : 'it_IT' })) {
        html = html.replace(new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*("[^>]*>)`), (_, before, after) => `${before}${escape(value)}${after}`);
      }
      // A missing page declares no canonical; noindex pages declare no language alternates.
      html = meta.canonical
        ? html.replace(/(<link rel="canonical" href=")[^"]*("[^>]*>)/, (_, before, after) => `${before}${escape(meta.canonical)}${after}`)
        : html.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '');
      const alternates = meta.indexable ? ['it', 'en', 'x-default'].map(locale => `<link rel="alternate" hreflang="${locale}" href="${siteUrl(route, locale === 'en' ? 'en' : 'it')}" />`).join('\n') + '\n' : '';
      const schema = JSON.stringify(structuredData(route, language)).replaceAll('<', '\\u003c');
      html = html.replace('</head>', `${alternates}<script id="delir-structured-data" type="application/ld+json">${schema}</script>\n</head>`);
      // Secondary route styles are lazy in the client build; include them for the initial document too.
      html = html.replace('</head>', `${styles}\n</head>`);
      html = html.replace('<body>', '<body><noscript><link rel="stylesheet" href="/no-script.css" />' + (language === 'it' ? '<p>Per inviare una richiesta, attiva JavaScript oppure scrivi a <a href="mailto:contact@delir.it">contact@delir.it</a>.</p>' : '<p>To send an enquiry, enable JavaScript or email <a href="mailto:contact@delir.it">contact@delir.it</a>.</p>') + '</noscript>');
      // Retain React's initial layout without permitting inline styles in the CSP.
      html = html.replace(/ style="([^"]*)"/g, (_, declarations) => {
        if (!staticStyles.has(declarations)) staticStyles.set(declarations, `s${staticStyles.size}`);
        return ` data-prerender-style="${staticStyles.get(declarations)}"`;
      });
      html = html.replace('</head>', '<link rel="stylesheet" href="/seo/prerender.css" />\n</head>');
      const name = route === '/' ? 'home' : route.slice(1);
      await writeFile(path.join(root, `dist/seo/${name}.${language}.html`), html);
      if (route === '/' && language === 'it') await writeFile(path.join(root, 'dist/index.html'), html);
    }
  }
  await writeFile(path.join(root, 'dist/seo/prerender.css'), [...staticStyles].map(([declarations, id]) => `[data-prerender-style="${id}"]{${declarations.replaceAll('&quot;', '"').replaceAll('&amp;', '&')}}`).join('\n'));
  await writeSearchDocuments({ pageMetadata, indexableRoutes, siteUrl });
  console.log(`Prerendered ${(siteRoutes.length + 1) * 2} documents (IT/EN), including a real 404 document.`);
} finally {
  // Fixed child of this build directory; never remove the workspace or its parent.
  await rm(temporary, { recursive: true, force: true });
}
