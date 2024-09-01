const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    console.log(playlistId);
    const playlistInformationQuery = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const songsInformationQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
        LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const playlistInformation = await this._pool.query(playlistInformationQuery);
    const songsInformation = await this._pool.query(songsInformationQuery);
    return {
      playlist: {
        id: playlistInformation.rows[0].id,
        name: playlistInformation.rows[0].name,
        songs: songsInformation.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
