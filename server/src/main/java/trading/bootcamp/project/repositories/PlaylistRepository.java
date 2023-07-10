package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.enums.Type;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlaylistRepository {

    List<PlaylistEntity> listPlaylistsByUser(UUID userId);

    Optional<PlaylistEntity> getPlaylistById(UUID id);

    int createPlaylist(UUID id, UUID userId, String name, String description, LocalDate createDate, Type type);

    int deletePlaylist(UUID id);

    List<UUID> getSongsInPlaylistIDs(UUID playlistId);
}
