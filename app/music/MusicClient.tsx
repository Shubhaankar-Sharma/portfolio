"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './music.module.css';
import type { MusicData } from './page';

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

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeLink}>← home</Link>
      <div className={styles.header}>
        <h1>spongeboi's music corner</h1>
        <p className={styles.subtitle}>
          Music recommendations and thoughts on what I'm listening to.
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

      {musicData.recommendations && musicData.recommendations.length > 0 && (
        <div className={styles.recommendationsSection}>
          <h2 className={styles.sectionTitle}>Recommendations</h2>
          <div className={styles.recommendationsList}>
            {musicData.recommendations.map((item, idx) => (
              <div key={idx} className={styles.recommendationItem}>
                {item.albumArt && (
                  <img src={item.albumArt} alt={item.title} className={styles.albumArt} />
                )}
                <div className={styles.recommendationInfo}>
                  <span className={styles.musicTitle}>{item.title}</span>
                  <span className={styles.musicMeta}>
                    {item.artist}
                    {item.year && `, ${item.year}`}
                  </span>
                  {item.note && <span className={styles.musicNote}>{item.note}</span>}
                  {item.links && (
                    <div className={styles.platformLinks}>
                      {item.links.spotify && (
                        <a href={item.links.spotify} target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                          Spotify
                        </a>
                      )}
                      {item.links.appleMusic && (
                        <a href={item.links.appleMusic} target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                          Apple Music
                        </a>
                      )}
                      {item.links.tidal && (
                        <a href={item.links.tidal} target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                          Tidal
                        </a>
                      )}
                      {item.links.youtube && (
                        <a href={item.links.youtube} target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                          YouTube
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
