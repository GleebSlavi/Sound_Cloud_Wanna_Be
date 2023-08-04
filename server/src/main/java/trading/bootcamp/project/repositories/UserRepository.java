package trading.bootcamp.project.repositories;

import org.springframework.cglib.core.Local;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.UserEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    List<UserEntity> listUsers();

    List<UserEntity> searchForUsers(List<String> ids);

    List<UserEntity> getAllPremiumUsers();

    Optional<UserEntity> getUserById(UUID id);

    Optional<UserEntity> getUserByUsername(String username);

    int createUser(UUID id, String username, String email, String password, LocalDate createDate, String imageUrl, Boolean isPremium, Integer leftSongs, LocalDate subEndDate);

    int deleteUser(UUID id);

    int updateUserPassword(UUID id, String password);

    int updateUserImageUrl(UUID id, String imageUrl);

    int updateUserLeftSongs(UUID id, Integer leftSongs);

    int resetLeftSongs(Integer leftSongs);

    int updateUserPremium(UUID id, Boolean isPremium, LocalDate endDate);

    List<PlaylistEntity> getUserFavouritePlaylists(UUID userId, Integer offset, Integer limit);

    int insertFavoritePlaylist(UUID userId, UUID playlistId);

    boolean isFavoritePlaylistOfUser(UUID userId, UUID playlistId);

    int addToFavorites(UUID userId, UUID playlistId);

    int removeFromFavorites(UUID userId, UUID playlistId);
}
