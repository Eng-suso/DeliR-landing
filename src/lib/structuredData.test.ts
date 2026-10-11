import { describe, expect, it } from 'vitest';
import { faqContent } from './faqContent';
import { structuredData } from './structuredData';
import { pageMetadata } from './siteMetadata';

describe('public search metadata', () => {
  it.each(['it', 'en'] as const)('uses the visible %s FAQ as its only answer source', language => {
    const data = structuredData('/', language);
    const faq = data['@graph'].find(item => '@type' in item && item['@type'] === 'FAQPage');
    expect(faq).toMatchObject({ mainEntity: faqContent[language].faqs.map(([, question, answer]) => ({ name: question, acceptedAnswer: { text: answer } })) });
    expect(structuredData('/pilot', language)['@graph']).toHaveLength(2);
  });
  it('keeps draft notices, closed updates and missing pages out of search', () => {
    for (const path of ['/privacy', '/waitlist', '/missing']) expect(pageMetadata(path, 'it').robots).toBe('noindex, follow');
    expect(pageMetadata('/pilot', 'en').canonical).toBe('https://delir.it/pilot?lang=en');
    expect(pageMetadata('/', 'it').canonical).toBe('https://delir.it/');
  });
});
