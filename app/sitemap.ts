import { MetadataRoute } from 'next';
import { STORE_PRODUCTS } from './data/store-products';
import { courses } from './data/courses';
import { learningTracks } from './data/learningTracks';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sof-beta.vercel.app';

  const staticRoutes = [
    '',
    '/store',
    '/events',
    '/scanner',
    '/women-hub',
    '/skills',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/refund',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const storeProductRoutes = STORE_PRODUCTS.map((product) => ({
    url: `${baseUrl}/store/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const trackRoutes = learningTracks.map((track) => ({
    url: `${baseUrl}/tracks/${track.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...storeProductRoutes, ...courseRoutes, ...trackRoutes];
}
