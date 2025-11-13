/**
 * Script to generate a Spotify refresh token
 * Run this once to get your refresh token, then add it to .env.local
 *
 * Usage: node scripts/get-spotify-refresh-token.js
 */

const readline = require('readline');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://127.0.0.1:3000/api/spotify/callback';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎵 Spotify Refresh Token Generator\n');
console.log('Step 1: Authorize your app');
console.log('----------------------------------------');

// Step 1: Generate authorization URL
const scopes = 'user-read-currently-playing user-read-playback-state';
const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;

console.log('\nOpen this URL in your browser:\n');
console.log(authUrl);
console.log('\n');
console.log('After authorizing, you\'ll be redirected to a URL that looks like:');
console.log('http://127.0.0.1:3000/api/spotify/callback?code=XXXXXXXX');
console.log('\n');
console.log('NOTE: Make sure to add http://127.0.0.1:3000/api/spotify/callback');
console.log('to your Spotify app\'s Redirect URIs in the dashboard first!');
console.log('\n');

rl.question('Paste the full redirect URL here: ', async (redirectUrl) => {
  try {
    // Extract the code from the URL
    const url = new URL(redirectUrl);
    const code = url.searchParams.get('code');

    if (!code) {
      console.error('❌ No code found in the URL. Please try again.');
      rl.close();
      return;
    }

    console.log('\n\nStep 2: Exchanging code for tokens...\n');

    // Step 2: Exchange code for tokens
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('❌ Error:', data.error_description || data.error);
      rl.close();
      return;
    }

    console.log('✅ Success! Here are your tokens:\n');
    console.log('----------------------------------------');
    console.log('Add these to your .env.local file:');
    console.log('----------------------------------------\n');
    console.log(`SPOTIFY_CLIENT_ID=${CLIENT_ID}`);
    console.log(`SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    console.log('\n----------------------------------------\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  rl.close();
});
