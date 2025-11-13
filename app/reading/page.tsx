import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import WritingClient from './WritingClient';

export const metadata: Metadata = {
  title: 'Writing & Reading',
  description: 'Technical articles, research notes, and curated reading list covering systems programming, distributed systems, AI, and more.',
  openGraph: {
    title: 'Writing & Reading',
    description: 'Technical articles, research notes, and curated reading list covering systems programming, distributed systems, AI, and more.',
  },
};

export type WritingItem = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  status: 'published' | 'draft' | 'research';
};

export type Link = {
  title: string;
  url: string;
  authors?: string;
  author?: string;
  year?: string;
  note?: string;
};

export type LinkSubcategory = {
  name: string;
  links: Link[];
};

export type LinkCategory = {
  name: string;
  subcategories?: LinkSubcategory[];
  links?: Link[];
};

export type LinksData = {
  onMyDesk?: Link[];
  futureReading?: Link[];
  categories: LinkCategory[];
};

async function getWritingItems(): Promise<WritingItem[]> {
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
          tags: data.tags || [],
          status: data.status || 'published',
        };
      })
    );

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    return [];
  }
}

async function getLinks(): Promise<LinksData> {
  try {
    const linksPath = path.join(process.cwd(), 'content/links.json');
    const linksContent = await fs.readFile(linksPath, 'utf8');
    return JSON.parse(linksContent);
  } catch (error) {
    return { categories: [], onMyDesk: [], futureReading: [] };
  }
}

export default async function WritingPage() {
  const allItems = await getWritingItems();
  // Filter out drafts - only show published items
  const items = allItems.filter(item => item.status === 'published');
  const linksData = await getLinks();

  // Get all unique tags
  const allTags = Array.from(
    new Set(items.flatMap(item => item.tags))
  ).sort();

  return <WritingClient items={items} allTags={allTags} linksData={linksData} />;
}
