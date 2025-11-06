import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import GreenContextSimulation from '../../components/GreenContextSimulation';
import { formatDate } from '../../utils/dateFormat';
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const { frontmatter, content } = await getArticle(slug);

  return (
    <>
      <Link href="/writing" className={styles.backLink}>
        ← Back
      </Link>

      {frontmatter.image && (
        <div className={styles.heroImage}>
          <img src={frontmatter.image} alt={frontmatter.title} />
        </div>
      )}

      <div className={styles.container}>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{frontmatter.title}</h1>
            <span className={styles.date}>{formatDate(frontmatter.date)}</span>
          </header>

          <div className={styles.content}>
            <MDXRemote
              source={content}
              components={{
                GreenContextSimulation,
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
