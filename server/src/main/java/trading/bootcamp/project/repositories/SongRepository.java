package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.SongEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SongRepository {

    List<SongEntity> listSongsByUser(UUID userId);

    List<SongEntity> searchForSongs(List<String> ids);

    Optional<SongEntity> getSongById(UUID id);

    int createSong(UUID id, UUID userId, String name, String artist, Integer releaseYear, Double duration,
                   LocalDate uploadDate, String imageUrl, String couldUrl);

    int deleteSong(UUID id);

    int addSongToPlaylist(UUID playlistId, UUID songId);
}
