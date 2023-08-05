package trading.bootcamp.project.repositories.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.SongRepository;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.repositories.mappers.SongRowMapper;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class SongRepositoryImpl implements SongRepository {

    private final JdbcTemplate jdbcTemplate;
    @Override
    public List<SongEntity> listSongsByUser(UUID userId) {
        return jdbcTemplate.query(Queries.LIST_SONGS_BY_USER,
            new SongRowMapper(), userId.toString());
    }

    @Override
    public List<SongEntity> searchForSongs(List<String> ids) {
        return jdbcTemplate.query(String.format(Queries.SEARCH_FOR_SONGS,
                String.join(", ", Collections.nCopies(ids.size(), "?"))),
                new SongRowMapper(), ids.toArray());
    }

    @Override
    public Optional<SongEntity> getSongById(UUID id) {
        return jdbcTemplate.query(Queries.GET_SONG_BY_ID,
            new SongRowMapper(), id.toString())
            .stream()
            .findFirst();
    }

    @Override
    public int createSong(UUID id, UUID userId, String name, String artist, Integer releaseYear, Double duration,
                          LocalDate uploadDate, String imageUrl, String couldUrl) {
        return jdbcTemplate.update(Queries.INSERT_SONG, id.toString(), userId.toString(),
            name, artist, releaseYear, duration, uploadDate.toString(), imageUrl, couldUrl);
    }

    @Override
    public int deleteSong(UUID id) {
        return jdbcTemplate.update(Queries.DELETE_SONG, id.toString());
    }

    @Override
    public int addSongToPlaylist(UUID playlistId, UUID songId) {
        return jdbcTemplate.update(Queries.ADD_SONG_TO_PLAYLIST, playlistId.toString(), songId.toString());
    }

    private static class Queries {

        private final static String SELECT_SONG_QUERY = """
                SELECT id, user_id, name, artist, release_year, duration, upload_date, image_url, cloud_url
                FROM song
                WHERE %s
                """;

        public final static String SEARCH_FOR_SONGS = """
                SELECT id, user_id, name, artist, release_year, duration, upload_date, image_url, cloud_url
                FROM song
                WHERE id IN (%s)
                LIMIT 100;
                """;

        public final static String ADD_SONG_TO_PLAYLIST = """
                INSERT INTO playlist_song(playlist_id, song_id)
                VALUES(?, ?);
                """;
        public final static String LIST_SONGS_BY_USER = """
                 SELECT id, user_id, name, artist, release_year, duration, upload_date, image_url, cloud_url
                FROM song
                WHERE user_id = ?
                LIMIT 100;
                """;

        public final static String GET_SONG_BY_ID = """
                 SELECT id, user_id, name, artist, release_year, duration, upload_date, image_url, cloud_url
                FROM song
                WHERE id = ?;
                """;

        public final static String INSERT_SONG = """
                INSERT INTO song(id, user_id, name, artist, release_year, duration, upload_date, image_url, cloud_url)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);
                """;

        public final static String DELETE_SONG = """
                DELETE FROM song
                WHERE id = ?;
                """;
    }
}
