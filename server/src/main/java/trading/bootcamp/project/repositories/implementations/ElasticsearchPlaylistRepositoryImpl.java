package trading.bootcamp.project.repositories.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.data.elasticsearch.core.query.IndexQueryBuilder;
import org.springframework.stereotype.Repository;
import trading.bootcamp.project.repositories.ElasticsearchPlaylistRepository;
import trading.bootcamp.project.repositories.entities.ElasticsearchPlaylistEntity;
import trading.bootcamp.project.repositories.entities.ElasticsearchSongEntity;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ElasticsearchPlaylistRepositoryImpl implements ElasticsearchPlaylistRepository {

    private static final String PLAYLIST_INDEX = "playlist";

    private final ElasticsearchOperations elasticsearchOperations;

    @Override
    public String createPlaylistIndex(ElasticsearchPlaylistEntity playlist) {
        IndexQuery indexQuery = new IndexQueryBuilder()
                .withId(playlist.getId().toString())
                .withObject(playlist)
                .build();

        return elasticsearchOperations.index(indexQuery, IndexCoordinates.of(PLAYLIST_INDEX));
    }

    @Override
    public List<String> searchForPlaylist(String search) {
        Criteria criteria = new Criteria("name").contains(search).and("type").is("PUBLIC");
        CriteriaQuery query = new CriteriaQuery(criteria);

        SearchHits<ElasticsearchPlaylistEntity> songs = elasticsearchOperations.search(query, ElasticsearchPlaylistEntity.class, IndexCoordinates.of(PLAYLIST_INDEX));

        return songs
                .getSearchHits()
                .stream()
                .map(SearchHit::getContent)
                .map(ElasticsearchPlaylistEntity::getId)
                .map(UUID::toString)
                .toList();
    }

    @Override
    public String deletePlaylistIndex(UUID id) {
        return elasticsearchOperations.delete(id.toString(), IndexCoordinates.of(PLAYLIST_INDEX));
    }
}
