import { memo } from "react";
import Markdown from 'react-markdown';
import NextLink from 'next/link';
import rehypeRaw from 'rehype-raw';
import NekiEmoji from './components/NekiEmoji';

type RichTextProps = {
  text: string,
};

const Link: React.FC<React.JSX.IntrinsicElements['a']> = memo(({ href, children }) => {
  // If no href, just render children as text
  if (!href) {
    return <>{children}</>;
  }

  // Check if it's an internal link
  const isInternal = href.startsWith('/');

  // Add neki emoji after links to neki.dev
  if (href === 'https://neki.dev') {
    return (
      <a href={href} target='_blank'>
        {children}
        <NekiEmoji />
      </a>
    );
  }

  // Use Next.js Link for internal links
  if (isInternal) {
    return <NextLink href={href}>{children}</NextLink>;
  }

  return <a href={href} target='_blank'>{children}</a>;
});

const components: Partial<{ [TagName in keyof React.JSX.IntrinsicElements]: React.FunctionComponent<React.JSX.IntrinsicElements[TagName]> }> = {
  a: Link,
};

const RichText: React.FC<RichTextProps> = ({
  text
}) => {
  return (
    <Markdown
      components={components as any}
      rehypePlugins={[rehypeRaw]}
    >
      {text}
    </Markdown>
  )
}

export default RichText;