import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/spotify-login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/admin/spotify-login?error=no_code', request.url)
    );
  }

  try {
    const redirectUri = `${new URL(request.url).origin}/api/spotify/callback`;
    const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.redirect(
        new URL(`/admin/spotify-login?error=${encodeURIComponent(data.error)}`, request.url)
      );
    }

    // Redirect back to login page with the refresh token
    return NextResponse.redirect(
      new URL(`/admin/spotify-login?token=${encodeURIComponent(data.refresh_token)}`, request.url)
    );
  } catch (error) {
    console.error('Spotify callback error:', error);
    return NextResponse.redirect(
      new URL(`/admin/spotify-login?error=${encodeURIComponent(String(error))}`, request.url)
    );
  }
}
