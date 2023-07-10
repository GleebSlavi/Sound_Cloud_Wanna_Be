package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.sqls.SongEntity;
import trading.bootcamp.project.repositories.entities.enums.Genre;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SongRepository {

    List<SongEntity> listSongsByUser(UUID userId);

    Optional<SongEntity> getSongById(UUID id);

    int createSong(UUID id, UUID userId, String name, String artist, Integer releaseYear,
                   Genre genre, LocalDate uploadDate, String imageUrl, String couldUrl);

    int deleteSong(UUID id);
}