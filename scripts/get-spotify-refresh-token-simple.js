/**
 * Simple Spotify refresh token generator
 * This uses a manual OAuth flow without requiring a callback server
 *
 * Usage: node scripts/get-spotify-refresh-token-simple.js
 */

const readline = require('readline');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎵 Spotify Refresh Token Generator (Simple Method)\n');
console.log('Step 1: Get Authorization Code');
console.log('----------------------------------------');
console.log('\nIn Spotify Dashboard:');
console.log('1. Go to https://developer.spotify.com/dashboard');
console.log('2. Click on your app');
console.log('3. Click "Settings"');
console.log('4. Add this to Redirect URIs: https://example.com/callback');
console.log('5. Click "Save"');
console.log('\n');

// Use a simple HTTPS redirect URI
const REDIRECT_URI = 'https://example.com/callback';
const scopes = 'user-read-currently-playing user-read-playback-state';
const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;

console.log('Step 2: Authorize the app');
console.log('----------------------------------------');
console.log('\nOpen this URL in your browser:\n');
console.log(authUrl);
console.log('\n');
console.log('After clicking "Agree", you\'ll be redirected to a page that might show an error.');
console.log('That\'s OK! Just copy the ENTIRE URL from your browser address bar.');
console.log('It will look like: https://example.com/callback?code=XXXXXXXX');
console.log('\n');

rl.question('Paste the full URL here: ', async (redirectUrl) => {
  try {
    // Extract the code from the URL
    const url = new URL(redirectUrl);
    const code = url.searchParams.get('code');

    if (!code) {
      console.error('❌ No code found in the URL. Please try again.');
      rl.close();
      return;
    }

    console.log('\n\nStep 3: Exchanging code for tokens...\n');

    // Exchange code for tokens
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

    console.log('✅ Success! Here\'s your refresh token:\n');
    console.log('----------------------------------------');
    console.log('Add this line to your .env.local file:');
    console.log('----------------------------------------\n');
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    console.log('\n----------------------------------------\n');
    console.log('Your complete .env.local should have:');
    console.log(`SPOTIFY_CLIENT_ID=${CLIENT_ID}`);
    console.log(`SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  rl.close();
});
