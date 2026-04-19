import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'], // Standard to disallow internal or private routes
    },
    sitemap: 'https://fine-print-ai-rouge.vercel.app/sitemap.xml',
  };
}
