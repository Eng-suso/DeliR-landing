import manifest from '../content/landingV2Media.json';
import { productClips } from './productClips';

export type VideoSlot = typeof manifest.slots[number];
export type VideoSlotId = VideoSlot['id'];
export const videoSlots = manifest.slots;

export function getVideoSlot(id: VideoSlotId) {
  const slot = videoSlots.find(item => item.id === id);
  if (!slot) throw new Error(`Unknown V2 video slot: ${id}`);
  return slot;
}

export function referenceClip(slot: VideoSlot) {
  return productClips[slot.referenceClip as keyof typeof productClips];
}

// One naming convention is shared by the player, studio and asset validator.
export function videoAssetPath(slot: VideoSlot, device: 'desktop' | 'mobile', language: 'it' | 'en', extension: 'mp4' | 'webm' | 'webp' | 'vtt') {
  return `${manifest.basePath}/${slot.id}.${device}.${language}.${extension}`;
}
