import { MetadataRoute } from 'next';
import { getCars } from '@/lib/cars';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.lux-auto.xyz';

  let cars: any[] = [];
  try {
    cars = await getCars();
  } catch (e) {
    console.error('Failed to fetch cars for sitemap:', e);
  }

  const carUrls = cars.map((car) => ({
    url: `${baseUrl}/car/${car.id}`,
    lastModified: new Date(car.updated_at || car.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...carUrls];
}
