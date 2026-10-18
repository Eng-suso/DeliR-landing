/* global console, process */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'src/content/landingV2Media.json'), 'utf8'));
const errors = [];
const ids = new Set();
if (manifest.version !== 1 || manifest.basePath !== '/landing-v2/media') errors.push('Unsupported manifest version or basePath.');
for (const slot of manifest.slots) {
  if (!/^[a-z][a-z0-9-]*$/.test(slot.id) || ids.has(slot.id)) errors.push(`Invalid or duplicate slot: ${slot.id}`);
  ids.add(slot.id);
  if (!['planned', 'ready'].includes(slot.status)) errors.push(`${slot.id}: use planned or ready.`);
  if (!(slot.seconds.min > 0 && slot.seconds.max >= slot.seconds.min)) errors.push(`${slot.id}: invalid duration.`);
  if (!Array.isArray(slot.devices) || !slot.devices.length || slot.devices.some(device => !['desktop', 'mobile'].includes(device)) || new Set(slot.devices).size !== slot.devices.length || !slot.devices.includes('desktop')) {
    errors.push(`${slot.id}: specify unique supported devices, including desktop.`);
    continue;
  }
  for (const device of ['desktop', 'mobile']) {
    if (!slot.devices.includes(device)) continue;
    const { width, height } = slot[device];
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 128 || height < 128 || width > 4096 || height > 4096 || width % 2 || height % 2) errors.push(`${slot.id}: ${device} dimensions must be even integers between 128 and 4096.`);
    for (const language of ['it', 'en']) {
      if (!slot.shots[language]?.length) errors.push(`${slot.id}: missing ${language} storyboard.`);
      const base = `${manifest.basePath}/${slot.id}.${device}.${language}`;
      if (process.argv.includes('--plan')) console.log(`${slot.id} [${slot.status}] ${slot.seconds.min}–${slot.seconds.max}s | ${width}×${height} | public${base}.{mp4,webm,webp,vtt}`);
      if (slot.status !== 'ready') continue;
      for (const ext of ['mp4', 'webm', 'webp', 'vtt']) {
        const file = path.join(root, 'public', `${base}.${ext}`);
        try {
          const info = await stat(file);
          const budget = ext === 'webp' ? 200_000 : ext === 'vtt' ? 100_000 : device === 'mobile' ? 3_000_000 : 5_000_000;
          if (!info.isFile() || info.size === 0 || info.size > budget) errors.push(`${base}.${ext}: empty, not a file or over ${budget} bytes.`);
          if (ext === 'vtt' && !(await readFile(file, 'utf8')).startsWith('WEBVTT')) errors.push(`${base}.${ext}: missing WEBVTT header.`);
        } catch { errors.push(`Missing ready asset: public${base}.${ext}`); }
      }
    }
  }
}
if (errors.length) {
  errors.forEach(error => console.error(error));
  process.exitCode = 1;
} else {
  console.log(`V2 media: ${manifest.slots.filter(slot => slot.status === 'ready').length}/${manifest.slots.length} ready; planned slots use existing stills and request no video files.`);
}
