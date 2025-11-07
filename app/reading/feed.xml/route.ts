import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const writingDir = path.join(process.cwd(), 'content/writing');

  try {
    const files = await fs.readdir(writingDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    const items = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(writingDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data } = matter(fileContent);

        return {
          slug: file.replace('.mdx', ''),
          title: data.title || 'Untitled',
          date: data.date || '',
          description: data.description || '',
        };
      })
    );

    const sortedItems = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masonjwang.com';

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>spongeboi's reading group</title>
    <link>${baseUrl}/reading</link>
    <description>Thoughts and links to awesome research papers, essays, and technical writing.</description>
    <language>en</language>
    <atom:link href="${baseUrl}/reading/feed.xml" rel="self" type="application/rss+xml" />
    ${sortedItems
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${baseUrl}/reading/${item.slug}</link>
      <guid>${baseUrl}/reading/${item.slug}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response('Error generating RSS feed', { status: 500 });
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
