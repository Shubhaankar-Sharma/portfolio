import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const filePath = path.join(process.cwd(), 'content/writing', `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spongeboi.com';

    const llmsTxt = `# ${data.title}

${data.description ? `## Description\n${data.description}\n\n` : ''}${data.date ? `Published: ${data.date}\n` : ''}${data.tags ? `Tags: ${data.tags.join(', ')}\n` : ''}
URL: ${baseUrl}/reading/${slug}

## Content

${content}
`;

    return new NextResponse(llmsTxt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Article not found', { status: 404 });
  }
}
