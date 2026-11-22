import { MetadataRoute } from 'next';
import { getLinks } from '@/lib/data';
import { slugify } from '@/lib/utils';
import { getAllArticles } from '@/lib/articles';
import { SITE_CONFIG } from '@/lib/site-config';
import { kitDefinitions } from '@/lib/kits';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const categories = await getLinks();
  const articles = await getAllArticles();

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/categoria/${slugify(category.name)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogEntries = articles.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/posts`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    { url: `${baseUrl}/kits`, changeFrequency: 'monthly', priority: 0.8 },
    ...kitDefinitions.map(kit => ({ url: `${baseUrl}/kits/${kit.slug}`, changeFrequency: 'monthly' as const, priority: 0.75 })),
    ...categoryEntries,
    ...blogEntries,
  ];
}
