package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlaylistRepository {

    List<PlaylistEntity> listPlaylistsByUser(UUID userId);

    Optional<PlaylistEntity> getPlaylistById(UUID id);

    int createPlaylist(UUID id, UUID userId, String name, String description, boolean isAllSongs, LocalDate createDate, PlaylistType type, String imageUrl);

    int deletePlaylist(UUID id);

    List<UUID> getSongsInPlaylistIDs(UUID playlistId);
}
