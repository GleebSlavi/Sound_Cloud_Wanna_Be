package trading.bootcamp.project.repositories.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.UserEntity;
import trading.bootcamp.project.repositories.mappers.PlaylistRowMapper;
import trading.bootcamp.project.repositories.mappers.UserRowMapper;

import java.time.LocalDate;
import java.util.Collections;
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
    public List<UserEntity> searchForUsers(List<String> ids) {
        return jdbcTemplate.query(String.format(Queries.SEARCH_FOR_USERS,
                String.join(", ", Collections.nCopies(ids.size(), "?"))),
                new UserRowMapper(), ids.toArray());
    }

    @Override
    public List<UserEntity> getAllPremiumUsers() {
        return jdbcTemplate.query(Queries.GET_PREMIUM_USERS,
                new UserRowMapper());
    }

    @Override
    public Optional<UserEntity> getUserById(UUID id) {
        return jdbcTemplate.query(Queries.GET_USER_BY_ID, new UserRowMapper(), id.toString())
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
    public int createUser(UUID id, String username, String email, String password, LocalDate createDate, String imageUrl,
                          Boolean isPremium, Integer leftSongs, LocalDate subsEndDate) {
        return jdbcTemplate.update(Queries.INSERT_USER,
                id.toString(), username, email, password, createDate.toString(), imageUrl, isPremium, leftSongs, subsEndDate);
    }

    @Override
    public int updateUserPassword(UUID id, String password) {
        return jdbcTemplate.update(String.format(Queries.UPDATE_USER, "password"), password, id.toString());
    }

    @Override
    public int updateUserImageUrl(UUID id, String imageUrl) {
        return jdbcTemplate.update(String.format(Queries.UPDATE_USER, "image_url"), imageUrl, id.toString());
    }

    @Override
    public int updateUserLeftSongs(UUID id, Integer leftSongs) {
        return jdbcTemplate.update(String.format(Queries.UPDATE_USER, "left_songs"), leftSongs, id.toString());
    }

    @Override
    public int resetLeftSongs(Integer leftSongs) {
        return jdbcTemplate.update(Queries.RESET_LEFT_SONGS, leftSongs);
    }

    @Override
    public int updateUserPremium(UUID id, Boolean isPremium, LocalDate endDate) {
        return jdbcTemplate.update(String.format(Queries.UPDATE_USER, "is_premium = ?, subscription_end_date"), isPremium, endDate.toString(), id.toString());
    }

    @Override
    public List<PlaylistEntity> getUserFavouritePlaylists(UUID userId, Integer offset, Integer limit) {
        return jdbcTemplate.query(Queries.GET_USER_FAVOURITE_PLAYLISTS,
                new PlaylistRowMapper(), userId.toString(), limit, offset);
    }

    @Override
    public boolean isFavoritePlaylistOfUser(UUID userId, UUID playlistId) {
        return !jdbcTemplate.queryForList(Queries.IS_FAVORITE_PLAYLIST, userId.toString(), playlistId.toString()).isEmpty();
    }

    @Override
    public int addToFavorites(UUID userId, UUID playlistId) {
        return jdbcTemplate.update(Queries.ADD_TO_FAVORITES, userId.toString(), playlistId.toString());
    }

    @Override
    public int removeFromFavorites(UUID userId, UUID playlistId) {
        return jdbcTemplate.update(Queries.REMOVE_FROM_FAVORITES, userId.toString(), playlistId.toString());
    }

    @Override
    public int insertFavoritePlaylist(UUID userId, UUID playlistId) {
        return jdbcTemplate.update(Queries.INSERT_FAVORITE_PLAYLIST, userId.toString(), playlistId.toString());
    }

    private static class Queries {

        public final static String GET_PREMIUM_USERS = """
                SELECT id, username, email, password, create_date, image_url, is_premium, left_songs, subscription_end_date
                FROM user
                WHERE is_premium = 1;
                """;

        public final static String RESET_LEFT_SONGS = """
                UPDATE user
                SET left_songs = ?;
                """;

        public final static String UPDATE_USER = """
                UPDATE user
                SET %s = ?
                WHERE id = ?;
                """;

        public final static String IS_FAVORITE_PLAYLIST = """
                SELECT user_id, playlist_id
                FROM user_playlist
                WHERE user_id = ? AND
                      playlist_id = ?;
                """;

        public final static String GET_USER_BY_ID = """
                SELECT id, username, email, password, create_date, image_url, is_premium, left_songs, subscription_end_date
                FROM user
                WHERE id = ?;
                """;

        public final static String GET_USER_BY_USERNAME = """
                SELECT id, username, email, password, create_date, image_url, is_premium, left_songs, subscription_end_date
                FROM user
                WHERE username = ?;
                """;

        public final static String ADD_TO_FAVORITES = """
                INSERT INTO user_playlist(user_id, playlist_id)
                VALUES(?, ?);
                """;

        public final static String REMOVE_FROM_FAVORITES = """
                DELETE FROM user_playlist
                WHERE user_id = ? AND playlist_id = ?;
                """;

        public final static String LIST_USERS = """
                SELECT id, username, email, password, create_date, image_url, is_premium, left_songs, subscription_end_date
                FROM user
                LIMIT 100;
                """;

        public final static String SEARCH_FOR_USERS = """
                SELECT id, username, email, password, create_date, image_url, is_premium, left_songs, subscription_end_date
                FROM user
                WHERE id IN (%s)
                LIMIT 100;
                """;

        public final static String INSERT_USER = """
                INSERT INTO user(id, username, email, password, create_date, image_url, is_premium, left_songs, subscription_end_date)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);
                """;

        public final static String DELETE_USER = """
                DELETE FROM user
                WHERE id = ?;
                """;

        public final static String GET_USER_FAVOURITE_PLAYLISTS = """
                SELECT p.id, p.user_id, p.name, p.description, p.is_all_songs, p.create_date, p.type, p.image_url
                FROM user_playlist up
                JOIN playlist p ON up.playlist_id = p.id
                WHERE up.user_id = ?
                LIMIT ? OFFSET ?;
                """;

        public final static String INSERT_FAVORITE_PLAYLIST = """
                INSERT INTO user_playlist(user_id, playlist_id)
                VALUES(?, ?);
                """;
    }
}

