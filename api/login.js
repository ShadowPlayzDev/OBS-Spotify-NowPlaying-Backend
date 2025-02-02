const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID, // From Vercel environment variables
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // From Vercel environment variables
  redirectUri: process.env.SPOTIFY_REDIRECT_URI // Also set in Vercel environment variables
});

module.exports = async (req, res) => {
    const authorizeURL = spotifyApi.createAuthorizeURL(['user-read-playback-state', 'streaming'], 'some-state'); // Add scopes
    res.redirect(authorizeURL);
};
