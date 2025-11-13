import { promises as fs } from 'fs';
import path from 'path';
import MusicClient from './MusicClient';

export type MusicItem = {
  title: string;
  artist?: string;
  year?: string;
  note?: string;
  description?: string;
  albumArt?: string;
  url?: string;
  type?: string;
  links?: {
    spotify?: string;
    appleMusic?: string;
    tidal?: string;
    youtube?: string;
  };
};

export type MusicData = {
  recommendations?: MusicItem[];
  playlists?: MusicItem[];
  albums?: MusicItem[];
  recentFinds?: MusicItem[];
};

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const basic = SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET
  ? Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
  : '';

async function getSpotifyAccessToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error('Spotify credentials not found');
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      // Cache token for 1 hour
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Failed to get Spotify access token:', response.status);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return null;
  }
}

async function fetchSpotifyMetadata(url: string, accessToken: string) {
  try {
    const match = url.match(/spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (!match) return null;

    const [, type, id] = match;
    const endpoint = `https://api.spotify.com/v1/${type}s/${id}`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // Cache metadata for 1 day
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${type} ${id}:`, response.status);
      return null;
    }

    const data = await response.json();

    // Format response based on type
    if (type === 'playlist') {
      return {
        url,
        type,
        name: data.name,
        description: data.description,
        image: data.images?.[0]?.url,
        owner: data.owner?.display_name,
        trackCount: data.tracks?.total,
      };
    } else if (type === 'album') {
      return {
        url,
        type,
        name: data.name,
        artist: data.artists?.map((a: any) => a.name).join(', '),
        releaseDate: data.release_date,
        image: data.images?.[0]?.url,
        trackCount: data.total_tracks,
      };
    } else if (type === 'track') {
      return {
        url,
        type,
        name: data.name,
        artist: data.artists?.map((a: any) => a.name).join(', '),
        album: data.album?.name,
        image: data.album?.images?.[0]?.url,
      };
    }
  } catch (error) {
    console.error('Error fetching metadata for', url, error);
    return null;
  }
}

async function enrichMusicDataWithMetadata(musicData: MusicData): Promise<MusicData> {
  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    console.log('No Spotify access token, returning data without enrichment');
    return musicData;
  }

  // Collect all URLs
  const urls: string[] = [];
  if (musicData.playlists) {
    urls.push(...musicData.playlists.map(p => p.url).filter(Boolean) as string[]);
  }
  if (musicData.albums) {
    urls.push(...musicData.albums.map(a => a.url).filter(Boolean) as string[]);
  }
  if (musicData.recentFinds) {
    urls.push(...musicData.recentFinds.map(t => t.url).filter(Boolean) as string[]);
  }

  // Fetch all metadata in parallel
  const metadataResults = await Promise.all(
    urls.map(url => fetchSpotifyMetadata(url, accessToken))
  );

  // Create metadata map
  const metadataMap: Record<string, any> = {};
  metadataResults.forEach((meta, idx) => {
    if (meta) {
      metadataMap[urls[idx]] = meta;
    }
  });

  // Enrich music data with metadata
  const enrichItem = (item: MusicItem) => {
    if (!item.url) return item;
    const meta = metadataMap[item.url];
    if (!meta) return item;

    return {
      ...item,
      title: meta.name || item.title,
      artist: meta.artist || item.artist,
      albumArt: meta.image || item.albumArt,
    };
  };

  return {
    playlists: musicData.playlists?.map(enrichItem),
    albums: musicData.albums?.map(enrichItem),
    recentFinds: musicData.recentFinds?.map(enrichItem),
  };
}

async function getMusicData(): Promise<MusicData> {
  try {
    const musicPath = path.join(process.cwd(), 'content/music.json');
    const musicContent = await fs.readFile(musicPath, 'utf8');
    const rawData = JSON.parse(musicContent);

    // Enrich with Spotify metadata
    const enrichedData = await enrichMusicDataWithMetadata(rawData);
    return enrichedData;
  } catch (error) {
    console.error('Error loading music data:', error);
    return { recommendations: [] };
  }
}

export default async function MusicPage() {
  const musicData = await getMusicData();
  return <MusicClient musicData={musicData} />;
}
