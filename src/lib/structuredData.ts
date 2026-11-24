import { faqContent } from './faqContent';
import { pageMetadata } from './siteMetadata';

const ORGANIZATION_ID = 'https://delir.it/#organization';
const SOFTWARE_ID = 'https://delir.it/#software';

export function structuredData(pathname: string, language: 'it' | 'en') {
  const meta = pageMetadata(pathname, language);
  // Entity facts only: no prices, ratings or reviews until they exist and are visible on the page.
  const graph: object[] = [
    { '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'DeliR', url: 'https://delir.it/', logo: 'https://delir.it/favicon.svg', email: 'contact@delir.it', sameAs: ['https://www.linkedin.com/company/delir/'] },
    { '@type': 'WebSite', '@id': 'https://delir.it/#website', name: 'DeliR', url: 'https://delir.it/', inLanguage: ['it', 'en'], publisher: { '@id': ORGANIZATION_ID } },
  ];
  // A missing page has no canonical URL to describe.
  if (meta.canonical) graph.push({ '@type': 'WebPage', '@id': `${meta.canonical}#webpage`, url: meta.canonical, name: meta.title, description: meta.description, inLanguage: language, isPartOf: { '@id': 'https://delir.it/#website' }, ...(pathname === '/' ? { about: { '@id': SOFTWARE_ID } } : {}) });
  if (pathname === '/') {
    graph.push({
      '@type': 'SoftwareApplication', '@id': SOFTWARE_ID, name: 'DeliR', url: 'https://delir.it/', description: meta.description,
      applicationCategory: 'BusinessApplication', operatingSystem: 'Web', inLanguage: ['it', 'en'], publisher: { '@id': ORGANIZATION_ID },
    });
    graph.push({
      '@type': 'FAQPage', '@id': `${meta.canonical}#faq`, inLanguage: language,
      mainEntity: faqContent[language].faqs.map(([, question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
