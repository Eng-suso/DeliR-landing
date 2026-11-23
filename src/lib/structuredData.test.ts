import { describe, expect, it } from 'vitest';
import { faqContent } from './faqContent';
import { structuredData } from './structuredData';
import { indexableRoutes, pageMetadata } from './siteMetadata';

describe('public search metadata', () => {
  it.each(['it', 'en'] as const)('uses the visible %s FAQ as its only answer source', language => {
    const data = structuredData('/', language);
    const faq = data['@graph'].find(item => '@type' in item && item['@type'] === 'FAQPage');
    expect(faq).toMatchObject({ mainEntity: faqContent[language].faqs.map(([, question, answer]) => ({ name: question, acceptedAnswer: { text: answer } })) });
    expect(structuredData('/pilot', language)['@graph'].map(item => (item as { '@type': string })['@type'])).toEqual(['Organization', 'WebSite', 'WebPage']);
  });
  it('keeps draft notices, closed updates and missing pages out of search', () => {
    for (const path of ['/privacy', '/waitlist', '/missing']) expect(pageMetadata(path, 'it').robots).toBe('noindex, follow');
    expect(pageMetadata('/pilot', 'en').canonical).toBe('https://delir.it/pilot?lang=en');
    expect(pageMetadata('/', 'it').canonical).toBe('https://delir.it/');
  });
  it('describes the organization and the product without commercial claims', () => {
    const graph = structuredData('/', 'en')['@graph'] as Record<string, unknown>[];
    const software = graph.find(item => item['@type'] === 'SoftwareApplication');
    expect(software).toMatchObject({ name: 'DeliR', description: pageMetadata('/', 'en').description, publisher: { '@id': 'https://delir.it/#organization' } });
    for (const claim of ['offers', 'aggregateRating', 'review']) expect(software).not.toHaveProperty(claim);
    expect(graph.find(item => item['@type'] === 'Organization')).toMatchObject({ url: 'https://delir.it/' });
  });
  it('gives missing pages no canonical and lists only indexable routes', () => {
    expect(pageMetadata('/missing', 'it').canonical).toBe('');
    expect(structuredData('/missing', 'it')['@graph'].some(item => (item as { '@type': string })['@type'] === 'WebPage')).toBe(false);
    expect(indexableRoutes).toEqual(['/', '/pilot', '/security-data', '/comparison-sources']);
  });
});
