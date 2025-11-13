import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Use client credentials flow for public metadata (doesn't require user authorization)
async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    // Cache token for 1 hour (Spotify tokens typically expire in 1 hour)
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    console.error('Failed to get access token:', response.status, await response.text());
    throw new Error('Failed to get access token');
  }

  return response.json();
}

async function getSpotifyMetadata(type: string, id: string, accessToken: string) {
  const endpoint = `https://api.spotify.com/v1/${type}s/${id}`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    // Cache metadata for 1 day (metadata rarely changes)
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    console.error(`Failed to fetch ${type} ${id}:`, response.status);
    return null;
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urls = searchParams.get('urls')?.split(',') || [];

    if (urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    const { access_token } = await getAccessToken();

    const metadataPromises = urls.map(async (url) => {
      try {
        // Extract type and ID from Spotify URL
        const match = url.match(/spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
        if (!match) return null;

        const [, type, id] = match;
        const data = await getSpotifyMetadata(type, id, access_token);

        if (!data) return null;

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
    });

    const metadata = await Promise.all(metadataPromises);
    const filteredMetadata = metadata.filter(m => m !== null);

    return NextResponse.json({ metadata: filteredMetadata });
  } catch (error) {
    console.error('Spotify Metadata API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
