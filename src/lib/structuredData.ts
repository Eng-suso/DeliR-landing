import { faqContent } from './faqContent';
import { pageMetadata } from './siteMetadata';

export function structuredData(pathname: string, language: 'it' | 'en') {
  const meta = pageMetadata(pathname, language);
  const graph: object[] = [
    { '@type': 'WebSite', '@id': 'https://delir.it/#website', name: 'DeliR', url: 'https://delir.it/', inLanguage: ['it', 'en'] },
    { '@type': 'WebPage', '@id': `${meta.canonical}#webpage`, url: meta.canonical, name: meta.title, description: meta.description, inLanguage: language, isPartOf: { '@id': 'https://delir.it/#website' } },
  ];
  if (pathname === '/') graph.push({
    '@type': 'FAQPage', '@id': `${meta.canonical}#faq`, inLanguage: language,
    mainEntity: faqContent[language].faqs.map(([, question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}
