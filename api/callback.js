const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// DATABASE LOGIC HERE

module.exports = async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  // Verify the state (important for security)
  if (state !== req.session.state) { // Example using sessions, adapt as needed
    return res.status(400).send('Invalid state');
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

// USER LOOKUP LOGIC

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    await storeRefreshToken(user.id, refreshToken); // Store refresh token

    spotifyApi.setAccessToken(accessToken); // Optional: Set on api object
    spotifyApi.setRefreshToken(refreshToken); // Optional: Set on api object

    res.redirect(process.env.WIX_SITE_URL); // Redirect to your Wix site

  } catch (err) {
    console.error('Error getting Tokens:', err);
    res.status(500).send('Error getting tokens.');
  }
};
