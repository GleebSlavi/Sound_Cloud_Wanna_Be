package trading.bootcamp.project.repositories.implementations.sqls;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.SongRepository;
import trading.bootcamp.project.repositories.entities.sqls.SongEntity;
import trading.bootcamp.project.repositories.entities.enums.Genre;
import trading.bootcamp.project.repositories.mappers.SongRowMapper;

import java.time.LocalDate;
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
    public Optional<SongEntity> getSongById(UUID id) {
        return jdbcTemplate.query(Queries.GET_SONG_BY_ID,
            new SongRowMapper(), id.toString())
            .stream()
            .findFirst();
    }

    @Override
    public int createSong(UUID id, UUID userId, String name, String artist, Integer releaseYear,
                          Genre genre, LocalDate uploadDate, String imageUrl, String couldUrl) {
        return jdbcTemplate.update(Queries.INSERT_SONG, id.toString(), userId.toString(),
            name, artist, releaseYear, genre.getGenre(), uploadDate.toString(), imageUrl, couldUrl);
    }

    @Override
    public int deleteSong(UUID id) {
        return jdbcTemplate.update(Queries.DELETE_SONG, id.toString());
    }

    private static class Queries {
        public final static String LIST_SONGS_BY_USER = """
                SELECT id, user_id, name, artist, release_year, genre, upload_date, image_url, cloud_url
                FROM song
                WHERE user_id = ?
                LIMIT 100;
                """;

        public final static String GET_SONG_BY_ID = """
                SELECT id, user_id, name, artist, release_year, genre, upload_date, image_url, cloud_url
                FROM song
                WHERE id = ?;
                """;

        public final static String INSERT_SONG = """
                INSERT INTO song(id, user_id, name, artist, release_year, genre, upload_date, image_url, cloud_url)
                FROM song
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);
                """;

        public final static String DELETE_SONG = """
                DELETE FROM song
                WHERE id = ?;
                """;
    }
}
