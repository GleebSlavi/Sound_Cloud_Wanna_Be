package trading.bootcamp.project.repositories.implementations.sqls;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.sqls.UserEntity;
import trading.bootcamp.project.repositories.mappers.UserRowMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<UserEntity> listUsers() {
        return jdbcTemplate.query(Queries.LIST_USERS, new UserRowMapper());
    }

    @Override
    public Optional<UserEntity> getUserById(UUID id) {
        return jdbcTemplate.query(Queries.GET_USER_BY_ID, new UserRowMapper(), id.toString())
                .stream()
                .findFirst();
    }

    @Override
    public Optional<UserEntity> getUserByEmail(String email) {
        return jdbcTemplate.query(Queries.GET_USER_BY_EMAIL, new UserRowMapper(), email)
                .stream()
                .findFirst();
    }

    @Override
    public Optional<UserEntity> getUserByUsername(String username) {
        return jdbcTemplate.query(Queries.GET_USER_BY_USERNAME, new UserRowMapper(), username)
                .stream()
                .findFirst();
    }

    @Override
    public int createUser(UUID id, String username, String email, String password, LocalDate createDate, String imageUrl) {
        return jdbcTemplate.update(Queries.INSERT_USER,
                id.toString(), username, email, password, createDate.toString(), imageUrl);
    }


    @Override
    public int deleteUser(UUID id) {
        return jdbcTemplate.update(Queries.DELETE_USER, id.toString());
    }

    @Override
    public List<UUID> getUserFavouritePlaylistsIDs(UUID userId) {
        return jdbcTemplate.query(Queries.GET_USER_FAVOURITE_PLAYLISTS_IDS,
            (resultSet, rowNum) -> UUID.fromString(resultSet.getString("playlist_id")), userId.toString());
    }

    private static class Queries {

        private final static String GET_USER_BY = """
                SELECT id, username, email, password, create_date, image_url
                FROM user
                WHERE %s = ?;
                """;

        public final static String LIST_USERS = """
                SELECT id, username, email, password, create_date, image_url
                FROM user
                LIMIT 100;
                """;

        public final static String GET_USER_BY_ID = String.format(GET_USER_BY, "id");

        public final static String GET_USER_BY_USERNAME = String.format(GET_USER_BY, "username");

        public final static String GET_USER_BY_EMAIL = String.format(GET_USER_BY, "email");

        public final static String INSERT_USER = """
                INSERT INTO user(id, username, email, password, create_date, image_url)
                VALUES(?, ?, ?, ?, ?, ?);
                """;

        public final static String DELETE_USER = """
                DELETE FROM user
                WHERE id = ?;
                """;

        public final static String GET_USER_FAVOURITE_PLAYLISTS_IDS = """
                SELECT playlist_id
                FROM user_playlist
                WHERE user_id = ?;
                """;
    }
}

