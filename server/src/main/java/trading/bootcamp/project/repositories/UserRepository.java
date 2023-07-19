package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.sqls.UserEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    List<UserEntity> listUsers();

    Optional<UserEntity> getUserById(UUID id);

    Optional<UserEntity> getUserByEmail(String email);

    Optional<UserEntity> getUserByUsername(String username);

    int createUser(UUID id, String username, String email, String password, LocalDate createDate, String imageUrl);

    int deleteUser(UUID id);

    int updateUserPassword(UUID id, String password);

    int updateUserImageUrl(UUID id, String imageUrl);

    List<PlaylistEntity> getUserFavouritePlaylists(UUID userId);

    int insertFavoritePlaylist(UUID userId, UUID playlistId);
}
