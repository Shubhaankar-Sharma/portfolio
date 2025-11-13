"use client";

import { useEffect, useState } from 'react';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'e000dea0126041b28fa0f6fa0ae89e4d';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/api/spotify/callback` : '';

export default function SpotifyLoginPage() {
  const [status, setStatus] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    // Check if we have a token in the URL (after redirect from callback)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      setRefreshToken(token);
      setStatus('success');
    } else if (error) {
      setStatus(`error: ${error}`);
    }
  }, []);

  const handleLogin = () => {
    const scopes = 'user-read-currently-playing user-read-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '100px auto',
      padding: '24px',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ marginBottom: '24px' }}>Spotify Integration Setup</h1>

      <div style={{
        background: '#f5f5f5',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '24px'
      }}>
        <p style={{ marginBottom: '12px' }}>
          Click the button below to authorize Spotify access. After authorization, you'll get a refresh token to add to your .env.local file.
        </p>
        <button
          onClick={handleLogin}
          style={{
            padding: '12px 24px',
            background: '#1DB954',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
        >
          Connect Spotify
        </button>
      </div>

      {status === 'success' && refreshToken && (
        <div style={{
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          padding: '16px',
          borderRadius: '4px',
          marginTop: '24px'
        }}>
          <h3 style={{ marginBottom: '12px', color: '#155724' }}>Success!</h3>
          <p style={{ marginBottom: '12px', color: '#155724' }}>
            Copy this refresh token to your .env.local file:
          </p>
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '4px',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            SPOTIFY_REFRESH_TOKEN={refreshToken}
          </div>
        </div>
      )}

      {status.startsWith('error') && (
        <div style={{
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          padding: '16px',
          borderRadius: '4px',
          marginTop: '24px',
          color: '#721c24'
        }}>
          <h3 style={{ marginBottom: '12px' }}>Error</h3>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
