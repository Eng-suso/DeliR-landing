import { useEffect } from 'react';
import { pageMetadata, siteUrl } from '../lib/siteMetadata';
import { structuredData } from '../lib/structuredData';
import { preload } from 'react-dom';
import { productClips } from '../lib/productClips';
import { heroPosterSizes } from '../lib/heroMedia';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';


export default function SiteMetadata() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    const hero = productClips.evidence;
    if (pathname === '/') preload(hero.poster, { as: 'image', imageSrcSet: hero.posterSrcSet, imageSizes: heroPosterSizes, fetchPriority: 'high' });
    const { title, description, robots, canonical, indexable } = pageMetadata(pathname, language);
    document.title = title;
    const setMeta = (attribute: 'name' | 'property', name: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.append(element);
      }
      element.content = content;
    };
    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', language === 'it' ? 'it_IT' : 'en_US');
    setMeta('property', 'og:locale:alternate', language === 'it' ? 'en_US' : 'it_IT');
    setMeta('property', 'og:url', canonical || 'https://delir.it/');
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) link?.remove();
    else {
      if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.append(link); }
      link.href = canonical;
    }
    for (const locale of ['it', 'en', 'x-default'] as const) {
      let alternate = document.head.querySelector<HTMLLinkElement>(`link[hreflang="${locale}"]`);
      if (!indexable) { alternate?.remove(); continue; }
      if (!alternate) { alternate = document.createElement('link'); alternate.rel = 'alternate'; alternate.hreflang = locale; document.head.append(alternate); }
      alternate.href = siteUrl(pathname, locale === 'en' ? 'en' : 'it');
    }
    let schema = document.getElementById('delir-structured-data');
    if (!schema) { schema = document.createElement('script'); schema.id = 'delir-structured-data'; schema.setAttribute('type', 'application/ld+json'); document.head.append(schema); }
    schema.textContent = JSON.stringify(structuredData(pathname, language));
  }, [language, pathname]);
  return null;
}
