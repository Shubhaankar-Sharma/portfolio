"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './writing.module.css';
import type { WritingItem, LinksData } from './page';
import { formatDate } from '../utils/dateFormat';

type WritingClientProps = {
  items: WritingItem[];
  allTags: string[];
  linksData: LinksData;
};

export default function WritingClient({ items, linksData }: WritingClientProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    const newOpenFolders = new Set(openFolders);
    if (newOpenFolders.has(path)) {
      newOpenFolders.delete(path);
    } else {
      newOpenFolders.add(path);
    }
    setOpenFolders(newOpenFolders);
  };

  const expandAll = () => {
    const allPaths = new Set<string>();
    linksData.categories.forEach(cat => {
      allPaths.add(cat.name);
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => {
          allPaths.add(`${cat.name}/${sub.name}`);
        });
      }
    });
    setOpenFolders(allPaths);
  };

  const collapseAll = () => {
    setOpenFolders(new Set());
  };

  const allExpanded = linksData.categories.every(cat => {
    const catOpen = openFolders.has(cat.name);
    const subsOpen = cat.subcategories?.every(sub => openFolders.has(`${cat.name}/${sub.name}`)) ?? true;
    return catOpen && subsOpen;
  });

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeLink}>← home</Link>
      <div className={styles.header}>
        <h1>spongeboi's reading group</h1>
        <p className={styles.subtitle}>
          Thoughts and links to awesome research papers, essays, and technical writing.
        </p>
        <a href="/writing/feed.xml" className={styles.rssLink}>RSS</a>
      </div>

      {linksData.onMyDesk && linksData.onMyDesk.length > 0 && (
        <div className={styles.currentSection}>
          <h2 className={styles.sectionTitle}>On My Desk</h2>
          <div className={styles.linksList}>
            {linksData.onMyDesk.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkItem}
              >
                <span className={styles.linkTitle}>{link.title}</span>
                {(link.authors || link.year) && (
                  <span className={styles.linkMeta}>
                    {link.authors && `${link.authors}`}
                    {link.authors && link.year && ', '}
                    {link.year}
                  </span>
                )}
                {link.note && <span className={styles.linkNote}>{link.note}</span>}
              </a>
            ))}
          </div>
        </div>
      )}

      {linksData.futureReading && linksData.futureReading.length > 0 && (
        <div className={styles.futureSection}>
          <h2 className={styles.sectionTitle}>Future Reading</h2>
          <div className={styles.linksList}>
            {linksData.futureReading.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkItem}
              >
                <span className={styles.linkTitle}>{link.title}</span>
                {(link.authors || link.year) && (
                  <span className={styles.linkMeta}>
                    {link.authors && `${link.authors}`}
                    {link.authors && link.year && ', '}
                    {link.year}
                  </span>
                )}
                {link.note && <span className={styles.linkNote}>{link.note}</span>}
              </a>
            ))}
          </div>
        </div>
      )}

      {linksData.categories.length > 0 && (
        <div className={styles.linksSection}>
          <div className={styles.linksSectionHeader}>
            <h2 className={styles.sectionTitle}>Links</h2>
            <button onClick={allExpanded ? collapseAll : expandAll} className={styles.expandButton}>
              {allExpanded ? 'collapse all' : 'expand all'}
            </button>
          </div>
          <div className={styles.folders}>
            {linksData.categories.map((category) => {
              const categoryPath = category.name;
              const isCategoryOpen = openFolders.has(categoryPath);

              return (
                <div key={category.name} className={styles.folder}>
                  <button
                    onClick={() => toggleFolder(categoryPath)}
                    className={styles.folderHeader}
                  >
                    <span className={styles.folderIcon}>{isCategoryOpen ? '▼' : '▶'}</span>
                    <span className={styles.folderName}>{category.name}</span>
                  </button>

                  {isCategoryOpen && (
                    <div className={styles.folderContent}>
                      {category.subcategories && category.subcategories.map((subcategory) => {
                        const subPath = `${categoryPath}/${subcategory.name}`;
                        const isSubOpen = openFolders.has(subPath);

                        return (
                          <div key={subcategory.name} className={styles.subfolder}>
                            <button
                              onClick={() => toggleFolder(subPath)}
                              className={styles.subfolderHeader}
                            >
                              <span className={styles.folderIcon}>{isSubOpen ? '▼' : '▶'}</span>
                              <span className={styles.folderName}>{subcategory.name}</span>
                            </button>

                            {isSubOpen && (
                              <div className={styles.linksList}>
                                {subcategory.links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.linkItem}
                                  >
                                    <span className={styles.linkTitle}>{link.title}</span>
                                    {(link.authors || link.year) && (
                                      <span className={styles.linkMeta}>
                                        {link.authors && `${link.authors}`}
                                        {link.authors && link.year && ', '}
                                        {link.year}
                                      </span>
                                    )}
                                    {link.note && <span className={styles.linkNote}>{link.note}</span>}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {category.links && (
                        <div className={styles.linksList}>
                          {category.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.linkItem}
                            >
                              <span className={styles.linkTitle}>{link.title}</span>
                              {link.author && <span className={styles.linkMeta}>{link.author}</span>}
                              {link.note && <span className={styles.linkNote}>{link.note}</span>}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.writingSection}>
        <h2 className={styles.sectionTitle}>Writing</h2>
        <div className={styles.list}>
          {items.map((item) => (
            <Link key={item.slug} href={`/writing/${item.slug}`} className={styles.item}>
              <span className={styles.date}>{formatDate(item.date)}</span>
              <h3 className={styles.title}>{item.title}</h3>
              {item.description && (
                <p className={styles.description}>{item.description}</p>
              )}
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className={styles.empty}>
            <p>No entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
