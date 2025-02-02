const SpotifyWebApi = require('spotify-web-api-node');
const { MongoClient } = require('mongodb'); // Or your database driver

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const mongoUri = process.env.DB_URI;

async function connectToDb() { // Reusable DB connection function
    try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        return client.db('your-database-name'); // Replace with your DB name
    } catch (error) {
        console.error("Error connecting to Now Playing Database:", error);
        throw error;
    }
}


module.exports = async (req, res) => {
    try {
        const db = await connectToDb();
        const usersCollection = db.collection('users'); // Replace with your collection name

        // IMPORTANT: User Lookup (replace with your actual user lookup logic)
        const user = await getUser(req); // This depends on your authentication
        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        const userDoc = await usersCollection.findOne({ _id: user._id });
        const refreshToken = userDoc.refreshToken;

        spotifyApi.setRefreshToken(refreshToken);

        const data = await spotifyApi.refreshAccessToken();
        const accessToken = data.body['access_token'];

        res.json({ accessToken }); // Send back the new access token

    } catch (err) {
        console.error('Error refreshing access token:', err);
        res.status(500).json({ error: 'Error refreshing token' });
    }
};

// Example getUser function (adapt to your authentication method)
async function getUser(req) {
    // Example using sessions (replace with your actual logic)
    if (req.session && req.session.user) {
      return req.session.user;
    }
    return null; // Or fetch user from database based on session data, etc.
}
