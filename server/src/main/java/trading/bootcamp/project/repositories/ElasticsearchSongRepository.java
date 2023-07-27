package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.ElasticsearchSongEntity;

import java.util.List;
import java.util.UUID;

public interface ElasticsearchSongRepository {

    String createSongIndex(ElasticsearchSongEntity song);

    List<String> searchForSong(String search);

    String deleteSongIndex(UUID id);
}
