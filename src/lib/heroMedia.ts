import itPoster from '../../artifacts/landing-media/images/hero-loop-v2.it.jpg';
import itPosterSrcSet from '../../artifacts/landing-media/images/hero-loop-v2.it.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import enPoster from '../../artifacts/landing-media/images/hero-loop-v2.en.jpg';
import enPosterSrcSet from '../../artifacts/landing-media/images/hero-loop-v2.en.jpg?w=480;960;1440;1920&format=webp&as=srcset';

export const heroMedia = {
  it: { poster: itPoster, posterSrcSet: itPosterSrcSet, mp4: '/product-clips/hero-loop-v2.it.mp4', captions: '/product-clips/hero-loop-v2.it.vtt' },
  en: { poster: enPoster, posterSrcSet: enPosterSrcSet, mp4: '/product-clips/hero-loop-v2.en.mp4', captions: '/product-clips/hero-loop-v2.en.vtt' },
};
export const heroPoster = itPoster;
export const heroPosterSrcSet = itPosterSrcSet;
export const heroPosterSizes = '(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1599px) calc(65vw - 90px), 950px';
