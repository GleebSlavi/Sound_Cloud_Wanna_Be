package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.ElasticsearchPlaylistEntity;

import java.util.List;
import java.util.UUID;

public interface ElasticsearchPlaylistRepository {

    String createPlaylistIndex(ElasticsearchPlaylistEntity playlist);

    List<String> searchForPlaylist(String search);

    String deletePlaylistIndex(UUID id);
}
