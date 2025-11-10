import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { Metadata } from 'next';
import GreenContextSimulation from '../../components/GreenContextSimulation';
import ClickableImage from '../../components/ClickableImage';
import { formatDate, calculateReadingTime } from '../../utils/dateFormat';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import styles from './article.module.css';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

async function getArticle(slug: string) {
  const filePath = path.join(process.cwd(), 'content/writing', `${slug}.mdx`);
  const fileContent = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // Extract headings (# and ##) from markdown
  const headings: Heading[] = [];
  const lines = content.split('\n');

  lines.forEach((line) => {
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);

    if (h1Match) {
      const text = h1Match[1];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 1 });
    } else if (h2Match) {
      const text = h2Match[1];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 2 });
    }
  });

  return {
    frontmatter: data,
    content,
    headings,
  };
}

export async function generateStaticParams() {
  const writingDir = path.join(process.cwd(), 'content/writing');

  try {
    const files = await fs.readdir(writingDir);
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => ({
        slug: file.replace('.mdx', ''),
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await getArticle(slug);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.image ? [
        {
          url: frontmatter.image,
          alt: frontmatter.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.image ? [frontmatter.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const { frontmatter, content } = await getArticle(slug);
  const readingTime = calculateReadingTime(content);

  return (
    <>
      <Link href="/reading" className={styles.backLink}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      <div className={styles.container}>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{frontmatter.title}</h1>
            {frontmatter.description && (
              <p className={styles.description}>{frontmatter.description}</p>
            )}
            <div className={styles.metadata}>
              <span className={styles.date}>{formatDate(frontmatter.date)}</span>
              <span className={styles.separator}>·</span>
              <span className={styles.readingTime}>{readingTime} min read</span>
            </div>
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className={styles.tags}>
                {frontmatter.tags.map((tag: string) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className={styles.content}>
            <MDXRemote
              source={content}
              components={{
                GreenContextSimulation,
                ClickableImage,
              }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkMath, remarkGfm],
                  rehypePlugins: [rehypeKatex, rehypeHighlight],
                },
              }}
            />
          </div>
        </article>
      </div>
    </>
  );
}
