package trading.bootcamp.project.repositories.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.repositories.mappers.PlaylistRowMapper;
import trading.bootcamp.project.repositories.mappers.SongRowMapper;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PlaylistRepositoryImpl implements PlaylistRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<PlaylistEntity> listPlaylistsByUser(UUID userId) {
        return jdbcTemplate.query(Queries.LIST_PLAYLISTS_BY_USER,
                new PlaylistRowMapper(), userId.toString());
    }

    @Override
    public List<PlaylistEntity> searchForPlaylists(List<String> ids) {
        return jdbcTemplate.query(String.format(Queries.SEARCH_FOR_PLAYLISTS,
                String.join(", ", Collections.nCopies(ids.size(), "?"))),
                new PlaylistRowMapper(), ids.toArray());
    }

    @Override
    public Optional<PlaylistEntity> getPlaylistById(UUID id) {
        return jdbcTemplate.query(Queries.GET_PLAYLIST_BY_ID,
                new PlaylistRowMapper(), id.toString())
                .stream()
                .findFirst();
    }

    @Override
    public Optional<PlaylistEntity> getPlaylistByName(String name) {
        return jdbcTemplate.query(Queries.GET_PLAYLIST_BY_NAME,
                        new PlaylistRowMapper(), name)
                .stream()
                .findFirst();
    }

    @Override
    public Optional<PlaylistEntity> getPlaylistByNameAndUserId(UUID userId, String playlistName) {
        return jdbcTemplate.query(Queries.GET_PLAYLIST_BY_NAME_AND_USER_ID,
                new PlaylistRowMapper(), playlistName, userId.toString())
                .stream()
                .findFirst();
    }

    @Override
    public Optional<PlaylistEntity> getAllSongsPlaylist(UUID userId) {
        return jdbcTemplate.query(Queries.GET_ALL_SONGS_PLAYLIST,
                        new PlaylistRowMapper(), userId.toString())
                .stream()
                .findFirst();
    }

    @Override
    public int createPlaylist(UUID id, UUID userId, String name, String description, boolean isAllSongs, LocalDate createDate, PlaylistType type, String imageUrl) {
        return jdbcTemplate.update(Queries.INSERT_PLAYLIST,
                id.toString(), userId.toString(), name, description, isAllSongs,
                createDate.toString(), type.name(), imageUrl);
    }

    @Override
    public int deletePlaylist(UUID id) {
        return jdbcTemplate.update(Queries.DELETE_PLAYLIST, id.toString());
    }

    @Override
    public List<SongEntity> getSongsInPlaylist(UUID playlistId) {
        return jdbcTemplate.query(Queries.GET_SONGS_IN_PLAYLIST_IDS,
            new SongRowMapper(), playlistId.toString());
    }

    @Override
    public int addSongToPlaylist(UUID playlistId, UUID songId) {
        return jdbcTemplate.update(Queries.ADD_SONG_TO_PLAYLIST, playlistId.toString(), songId.toString());
    }

    @Override
    public int removeSongFromPlaylist(UUID playlistId, UUID songId) {
        return jdbcTemplate.update(Queries.REMOVE_SONG_FROM_PLAYLIST, playlistId.toString(), songId.toString());
    }

    @Override
    public int changePlaylistType(UUID id, PlaylistType type) {
        return jdbcTemplate.update(Queries.CHANGE_PLAYLIST_TYPE, type.toString(), id.toString());
    }

    @Override
    public List<PlaylistEntity> allPlaylistsNotContainingSong(UUID userId, UUID songId) {
        return jdbcTemplate.query(Queries.ALL_PLAYLISTS_NOT_CONTAINING_SONG, new PlaylistRowMapper(),
                userId.toString(), songId.toString());
    }


    private static class Queries {

        private final static String SELECT_PLAYLIST_QUERY = """
                SELECT id, user_id, name, description, is_all_songs, create_date, type, image_url
                FROM playlist
                WHERE %s
                """;

        public final static String ALL_PLAYLISTS_NOT_CONTAINING_SONG = """
                SELECT id, user_id, name, description, is_all_songs, create_date, type, image_url
                FROM playlist
                WHERE user_id = ? AND is_all_songs = 0 AND id NOT IN (
                    SELECT playlist_id
                    FROM playlist_song
                    WHERE song_id = ? );
                """;

        public final static String GET_ALL_SONGS_PLAYLIST = String.format(SELECT_PLAYLIST_QUERY, """
                user_id = ? AND
                is_all_songs = 1;
                """);

        public final static String ADD_SONG_TO_PLAYLIST = """
                INSERT INTO playlist_song(playlist_id, song_id)
                VALUES(?, ?);
                """;

        public final static String REMOVE_SONG_FROM_PLAYLIST = """
                DELETE FROM playlist_song
                WHERE playlist_id = ? AND song_id = ?;
                """;

        public final static String CHANGE_PLAYLIST_TYPE = """
                UPDATE playlist
                SET type = ?
                WHERE id = ?;
                """;

        public final static String SEARCH_FOR_PLAYLISTS = """
                SELECT id, user_id, name, description, is_all_songs, create_date, type, image_url
                FROM playlist
                WHERE id IN (%s)
                LIMIT 100;
                """;

        public final static String GET_PLAYLIST_BY_NAME_AND_USER_ID = String.format(SELECT_PLAYLIST_QUERY, """
                name = ? AND
                user_id = ?;
                """);

        public final static String LIST_PLAYLISTS_BY_USER = """
                SELECT id, user_id, name, description, is_all_songs, create_date, type, image_url
                FROM playlist
                WHERE user_id = ?
                LIMIT 100;
                """;

        public final static String GET_PLAYLIST_BY_ID = """
                SELECT id, user_id, name, description, is_all_songs, create_date, type, image_url
                FROM playlist
                WHERE id = ?;
                """;

        public final static String GET_PLAYLIST_BY_NAME = """
                SELECT id, user_id, name, description, is_all_songs, create_date, type, image_url
                FROM playlist
                WHERE name = ?;
                """;

        public final static String INSERT_PLAYLIST = """
                INSERT INTO playlist(id, user_id, name, description, is_all_songs, create_date, type, image_url)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?);
                """;

        public final static String DELETE_PLAYLIST = """
                DELETE FROM playlist
                WHERE id = ?;
                """;

        public final static String GET_SONGS_IN_PLAYLIST_IDS = """
                SELECT id, user_id, name, artist, release_year, duration, type, upload_date, image_url, cloud_url
                FROM playlist_song ps
                JOIN song s ON ps.song_id = s.id
                WHERE playlist_id = ?;
                """;
    }
}
