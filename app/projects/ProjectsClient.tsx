"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './projects.module.css';
import RichText from '../RichText';
import Attachments from '../Attachments';

type ProjectsClientProps = {
  collections: any[];
};

export default function ProjectsClient({ collections }: ProjectsClientProps) {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeLink}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      <div className={styles.header}>
        <h1>Projects & Open Source</h1>
        <p className={styles.subtitle}>
          Things I've built and contributed to.
        </p>
      </div>

      {collections.map((collection) => (
        <div key={collection.name} className={styles.section}>
          <h2 className={styles.sectionTitle}>{collection.name}</h2>

          <div className={styles.items}>
            {collection.items.map((item: any, idx: number) => (
              <div key={item.id || idx} className={styles.item}>
                <div className={styles.itemMeta}>
                  {item.year}
                </div>
                <div className={styles.itemContent}>
                  {item.logo && (
                    <div className={styles.itemLogo}>
                      <Image src={item.logo} alt="" width={32} height={32} />
                    </div>
                  )}
                  <div className={styles.itemMain}>
                    <div className={styles.itemHeader}>
                      {item.url ? (
                        <a href={item.url} target="_blank" className={styles.itemTitle}>
                          {item.heading || item.title}
                        </a>
                      ) : (
                        <h3 className={styles.itemTitle}>{item.heading || item.title}</h3>
                      )}
                    </div>

                    {(item.company || item.institution || item.location) && (
                      <div className={styles.itemSubtitle}>
                        {item.company || item.institution}
                        {item.location && <span className={styles.location}> · {item.location}</span>}
                      </div>
                    )}

                    {item.description && (
                      <div className={styles.itemDescription}>
                        <RichText text={item.description} />
                      </div>
                    )}

                    {item.technologies && item.technologies.length > 0 && (
                      <div className={styles.technologies}>
                        {item.technologies.map((tech: string, i: number) => (
                          <span key={i} className={styles.tech}>{tech}</span>
                        ))}
                      </div>
                    )}

                    {item.attachments && item.attachments.length > 0 && (
                      <div className={styles.attachments}>
                        <Attachments attachments={item.attachments} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
