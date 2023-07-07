package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.searches.ElasticsearchSongEntity;
import trading.bootcamp.project.repositories.entities.sqls.SongEntity;

import java.util.List;
import java.util.UUID;

public interface ElasticsearchSongRepository {

    List<ElasticsearchSongEntity> searchSongsByName(String name);

    List<ElasticsearchSongEntity> searchSongsByArtist(String artist);

    List<ElasticsearchSongEntity> searchSongsByGenre(String genre);

    void insertSong(SongEntity song);

    void deleteSong(UUID id);
}
