export const prerender = false;

export async function GET() {
  const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
  const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

  try {
    // Exchange refresh token for a fresh access token
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });
    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return new Response(JSON.stringify({ error: 'Failed to refresh token' }), { status: 500 });
    }

    const headers = { Authorization: `Bearer ${access_token}` };

    const [recentRes, topArtistsRes] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', { headers }),
      fetch('https://api.spotify.com/v1/me/top/artists?limit=1&time_range=short_term', { headers }),
    ]);

    const recentData = await recentRes.json();
    const topArtistsData = await topArtistsRes.json();

    const tracks = (recentData.items || []).map((item) => ({
      name: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(', '),
      albumArt: item.track.album.images?.[2]?.url || item.track.album.images?.[0]?.url,
      url: item.track.external_urls.spotify,
    }));

    const topArtist = topArtistsData.items?.[0]
      ? {
          name: topArtistsData.items[0].name,
          image: topArtistsData.items[0].images?.[1]?.url || topArtistsData.items[0].images?.[0]?.url,
          url: topArtistsData.items[0].external_urls.spotify,
        }
      : null;

    return new Response(JSON.stringify({ tracks, topArtist }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Spotify fetch failed' }), { status: 500 });
  }
}