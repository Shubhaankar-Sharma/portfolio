# Spotify Refresh Token Setup

Since the callback redirect is giving issues, here's the easiest way:

## Method 1: Use Spotify's Web Console (Easiest)

1. Go to: https://developer.spotify.com/console/get-current-user-recently-played-tracks/
2. Click "Get Token"
3. Check these scopes:
   - `user-read-currently-playing`
   - `user-read-playback-state`
4. Click "Request Token"
5. Copy the token shown
6. **BUT WAIT** - this is an access token, not a refresh token

Actually, this method won't work for refresh tokens. Let me give you a better way...

## Method 2: Direct URL Exchange (Working Method)

The issue is that `https://example.com/callback` needs to be EXACTLY as you entered it in Spotify Dashboard.

**Double check your Spotify Dashboard:**

1. Go to https://developer.spotify.com/dashboard/applications
2. Click on your app (the one with Client ID: 2d7a592332ad480b8792f84acf0b6c99)
3. Click "Settings" button
4. Scroll to "Redirect URIs"
5. Check if `https://example.com/callback` is there EXACTLY (no trailing slash, no typos)
6. If not, add it and click "SAVE" (very important!)
7. Wait 30 seconds for changes to propagate

Then try the authorization URL again.

## Method 3: Use a different redirect URI

If example.com doesn't work, try using your actual portfolio domain:

1. In Spotify Dashboard, add: `https://masonjwang.com/api/spotify/callback`
2. Then I'll update the script to use that instead

Which method do you want to try?
