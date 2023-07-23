package trading.bootcamp.project.repositories.implementations.sqls;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;
import trading.bootcamp.project.repositories.entities.sqls.SongEntity;
import trading.bootcamp.project.repositories.mappers.PlaylistRowMapper;
import trading.bootcamp.project.repositories.mappers.SongRowMapper;

import java.time.LocalDate;
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

    private static class Queries {

        private final static String SELECT_PLAYLIST_QUERY = """
                SELECT id, user_id, name, description, is_all_songs, create_date, type, image_url
                FROM playlist
                WHERE %s
                """;

        public final static String GET_ALL_SONGS_PLAYLIST = String.format(SELECT_PLAYLIST_QUERY, """
                user_id = ? AND
                is_all_songs = 1;
                """);

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
