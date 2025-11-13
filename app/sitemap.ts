import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://shubhaankar.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/reading`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/music`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Get all writing articles
  const contentDirectory = path.join(process.cwd(), 'content', 'writing');
  const files = fs.readdirSync(contentDirectory);

  const articlePages: MetadataRoute.Sitemap = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(contentDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      const slug = file.replace('.mdx', '');

      // Only include published articles
      if (data.status !== 'published') {
        return null;
      }

      return {
        url: `${baseUrl}/reading/${slug}`,
        lastModified: data.date ? new Date(data.date) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return [...staticPages, ...articlePages];
}
