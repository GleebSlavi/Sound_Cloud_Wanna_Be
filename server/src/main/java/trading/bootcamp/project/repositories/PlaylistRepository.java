package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;
import trading.bootcamp.project.repositories.entities.SongEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlaylistRepository {

    List<PlaylistEntity> listPlaylistsByUser(UUID userId);

    List<PlaylistEntity> searchForPlaylists(List<String> ids);

    Optional<PlaylistEntity> getPlaylistById(UUID id);

    Optional<PlaylistEntity> getPlaylistByName(String name);

    Optional<PlaylistEntity> getPlaylistByNameAndUserId(UUID userId, String playlistName);

    Optional<PlaylistEntity> getAllSongsPlaylist(UUID userId);

    int createPlaylist(UUID id, UUID userId, String name, String description, boolean isAllSongs, LocalDate createDate, PlaylistType type, String imageUrl);

    int deletePlaylist(UUID id);

    List<SongEntity> getSongsInPlaylist(UUID playlistId, Integer offset, Integer limit);

    int addSongToPlaylist(UUID playlistId, UUID songId);

    int removeSongFromPlaylist(UUID playlistId, UUID songId);

    int changePlaylistType(UUID id, PlaylistType type);

    List<PlaylistEntity> allPlaylistsNotContainingSong(UUID userId, UUID songId);
}
