import { productClips } from '../lib/productClips';

// One recording per benefit, all from the same end-to-end demo case.
export const hybridBenefits = [
  { id: 'product-03', module: 0, initial: 'evidenze', clips: [productClips.evidence] },
  { id: 'product-02', module: 1, initial: 'lacune', clips: [productClips.gaps] },
  { id: 'product-05', module: 4, initial: 'scenari', clips: [productClips.scenarios] },
];

export const hybridExtraBenefits = [
  { id: 'product-01', module: 2, initial: 'contesto', clips: [productClips.context] },
  { id: 'product-04', module: 3, initial: 'decisioni', clips: [productClips.decisions] },
];

export const hybridDemoClips = [productClips.hero, ...hybridBenefits.map(benefit => benefit.clips[0])];
