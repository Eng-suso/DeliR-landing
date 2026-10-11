import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
import { createServer } from 'node:net';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { chromium } from '@playwright/test';
import { preview } from 'vite';

// Keep the existing route matrix, repeated lab runs and release budgets.
// Run against a fresh production preview; never reuse a developer's server.
const { ci } = JSON.parse(await readFile(process.argv[2] ?? 'lighthouserc.json', 'utf8'));
const outputDirectory = path.resolve(ci.upload.outputDir);
await mkdir(outputDirectory, { recursive: true });
const server = await preview({ configLoader: 'runner', preview: { host: '127.0.0.1', port: 0, strictPort: false } });
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
let browser;
let failed = false;
const summary = [];

function median(values) {
  const sorted = values.toSorted((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

try {
  const portServer = createServer();
  await new Promise(resolve => portServer.listen(0, '127.0.0.1', resolve));
  const debugPort = portServer.address().port;
  await new Promise(resolve => portServer.close(resolve));
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: [`--remote-debugging-port=${debugPort}`],
  });

  for (const configuredUrl of ci.collect.url) {
    const url = new URL(configuredUrl);
    const route = `${url.pathname}${url.search}`;
    const routeName = url.pathname === '/' ? 'home' : url.pathname.replaceAll('/', '-').slice(1);
    const results = [];
    for (let run = 1; run <= ci.collect.numberOfRuns; run += 1) {
      console.log(`Lighthouse ${route}, run ${run}/${ci.collect.numberOfRuns}`);
      const result = await lighthouse(`${origin}${route}`, {
        ...ci.collect.settings,
        // Closed signup routes intentionally remain out of search results.
        // Their noindex policy is asserted in the production browser smoke.
        skipAudits: ci.collect.noindexRoutes?.includes(url.pathname) ? ['is-crawlable'] : [],
        port: debugPort,
        logLevel: 'error',
        output: ['json', 'html'],
      }, ci.collect.settings.preset === 'desktop' ? desktopConfig : undefined);
      if (!result || result.lhr.runtimeError) {
        throw new Error(`Lighthouse failed on ${route}: ${result?.lhr.runtimeError?.message ?? 'no result'}`);
      }
      const expectedFormFactor = ci.collect.settings.preset === 'desktop' ? 'desktop' : ci.collect.settings.formFactor ?? 'mobile';
      if (result.lhr.configSettings.formFactor !== expectedFormFactor) {
        throw new Error(`Lighthouse used ${result.lhr.configSettings.formFactor}, expected ${expectedFormFactor}`);
      }
      results.push(result.lhr);
      for (const [index, extension] of ['json', 'html'].entries()) {
        await writeFile(path.join(outputDirectory, `${routeName}-${run}.${extension}`), result.report[index]);
      }
    }

    const checks = [];
    for (const [id, [level, budget]] of Object.entries(ci.assert.assertions)) {
      const values = results.map(result => id.startsWith('categories:')
        ? result.categories[id.slice('categories:'.length)]?.score
        : result.audits[id]?.numericValue);
      const value = values.every(Number.isFinite) ? median(values) : null;
      const passed = value !== null
        && (budget.minScore === undefined || value >= budget.minScore)
        && (budget.maxNumericValue === undefined || value <= budget.maxNumericValue);
      checks.push({ id, level, value, budget, passed });
      if (!passed) {
        console.log(`${level.toUpperCase()}: ${route} ${id} = ${value}; budget ${JSON.stringify(budget)}`);
        if (level === 'error') failed = true;
      }
    }
    const entry = { route, runs: results.length, checks };
    summary.push(entry);
    console.log(JSON.stringify(entry));
  }
  await writeFile(path.join(outputDirectory, 'summary.json'), JSON.stringify(summary, null, 2));
} finally {
  try {
    await browser?.close();
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
  }
}
if (failed) process.exitCode = 1;
