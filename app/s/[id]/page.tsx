import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

async function getShareData(id: string) {
  try {
    const sharePath = path.join(process.cwd(), '.shares', `${id}.json`);
    const data = await fs.readFile(sharePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const share = await getShareData(id);

  if (!share) {
    return {
      title: 'Shared Snippet',
    };
  }

  const excerpt = share.text.length > 200 ? share.text.substring(0, 200) + '...' : share.text;

  return {
    title: `"${excerpt}" - ${share.articleTitle}`,
    description: share.text,
    openGraph: {
      title: share.articleTitle,
      description: `"${excerpt}"`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: share.articleTitle,
      description: `"${excerpt}"`,
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const share = await getShareData(id);

  if (!share) {
    redirect('/reading');
  }

  // Redirect to the article with the share ID as a query param
  redirect(`/reading/${share.articleSlug}?highlight=${id}`);
}
