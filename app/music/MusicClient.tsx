"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './music.module.css';
import type { MusicData, MusicItem } from './page';

type MusicClientProps = {
  musicData: MusicData;
};

type NowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
};

export default function MusicClient({ musicData }: MusicClientProps) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['recentFinds']));

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        const data = await response.json();
        setNowPlaying(data);
      } catch (error) {
        setNowPlaying({ isPlaying: false });
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const renderMusicItem = (item: MusicItem, idx: number) => {
    return (
      <a
        key={idx}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.recommendationItem}
      >
        {item.albumArt && (
          <img src={item.albumArt} alt={item.title} className={styles.albumArt} />
        )}
        <div className={styles.recommendationInfo}>
          <span className={styles.musicTitle}>{item.title}</span>
          {item.artist && (
            <span className={styles.musicMeta}>
              {item.artist}
              {item.year && ` • ${item.year}`}
            </span>
          )}
          {(item.note || item.description) && (
            <span className={styles.musicNote}>{item.note || item.description}</span>
          )}
        </div>
      </a>
    );
  };

  const renderSection = (title: string, items: MusicItem[] | undefined, sectionKey: string) => {
    if (!items || items.length === 0) return null;

    const isOpen = openSections.has(sectionKey);

    return (
      <div className={styles.recommendationsSection}>
        <button
          onClick={() => toggleSection(sectionKey)}
          className={styles.sectionHeader}
        >
          <h2 className={styles.sectionTitle}>{title}</h2>
          <span className={styles.sectionToggle}>{isOpen ? '▼' : '▶'}</span>
        </button>
        {isOpen && (
          <div className={styles.recommendationsList}>
            {items.map((item, idx) => renderMusicItem(item, idx))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeLink}>← home</Link>
      <div className={styles.header}>
        <h1>spongeboi's music corner</h1>
        <p className={styles.subtitle}>
          My favorite playlists, albums, and recent musical discoveries.
        </p>
      </div>

      <div className={styles.nowPlayingSection}>
        <h2 className={styles.sectionTitle}>Now Playing</h2>
        {nowPlaying?.isPlaying ? (
          <a
            href={nowPlaying.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nowPlayingCard}
          >
            {nowPlaying.albumArt && (
              <img src={nowPlaying.albumArt} alt={nowPlaying.album} className={styles.albumArt} />
            )}
            <div className={styles.nowPlayingInfo}>
              <span className={styles.musicTitle}>{nowPlaying.title}</span>
              <span className={styles.musicMeta}>{nowPlaying.artist}</span>
              <span className={styles.liveIndicator}>🎵 Playing on Spotify</span>
            </div>
          </a>
        ) : (
          <div className={styles.notPlaying}>
            <span>Not currently listening to anything</span>
          </div>
        )}
      </div>

      {renderSection('Recent Finds', musicData.recentFinds, 'recentFinds')}
      {renderSection('Playlists', musicData.playlists, 'playlists')}
      {renderSection('Albums I Love', musicData.albums, 'albums')}
    </div>
  );
}
