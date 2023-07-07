package trading.bootcamp.project.repositories.implementations.searches;

import lombok.RequiredArgsConstructor;
import org.elasticsearch.client.RestClient;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.ElasticsearchSongRepository;
import trading.bootcamp.project.repositories.entities.searches.ElasticsearchSongEntity;
import trading.bootcamp.project.repositories.entities.sqls.SongEntity;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ElasticsearchSongRepositoryImpl implements ElasticsearchSongRepository {

    private final RestClient elasticsearchClient;

    @Override
    public List<UUID> searchSongsByTerm(String field, String term) {
        return null;
    }

    @Override
    public void insertSong(SongEntity song) {

    }

    @Override
    public void deleteSong(UUID id) {

    }
}
