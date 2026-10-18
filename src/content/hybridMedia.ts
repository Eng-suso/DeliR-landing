import { productClips } from '../lib/productClips';

// Each existing recording has one place; legacy scene links remain available.
export const hybridBenefits = [
  { id: 'product-03', module: 0, initial: 'evidenze-sul-processo', clips: [productClips.evidence, productClips.sources, productClips.review, productClips.corrected, productClips.owner] },
  { id: 'product-02', module: 1, initial: 'lacuna-aperta', clips: [productClips.gap, productClips.chat, productClips.hidden] },
  { id: 'product-05', module: 4, initial: 'confronto', clips: [productClips.comparison, productClips.simulationAsIs, productClips.simulationToBe, productClips.heatmap, productClips.eventLog] },
];

export const hybridExtraBenefits = [
  { id: 'product-01', module: 2, initial: 'memoria', clips: [productClips.memory] },
  { id: 'product-04', module: 3, initial: 'review-to-be', clips: [productClips.reviewToBe, productClips.hypothesis] },
];

export const hybridDemoClips = [productClips.hero, ...hybridBenefits.map(benefit => benefit.clips[0])];
