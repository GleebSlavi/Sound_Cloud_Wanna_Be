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
import trading.bootcamp.project.repositories.ElasticsearchSongRepository;
import trading.bootcamp.project.repositories.entities.ElasticsearchSongEntity;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ElasticsearchSongRepositoryImpl implements ElasticsearchSongRepository {

    private static final String SONG_INDEX = "song";

    private final ElasticsearchOperations elasticsearchOperations;

    @Override
    public String createSongIndex(ElasticsearchSongEntity song) {
        IndexQuery indexQuery = new IndexQueryBuilder()
                .withId(song.getId().toString())
                .withObject(song)
                .build();

        return elasticsearchOperations.index(indexQuery, IndexCoordinates.of(SONG_INDEX));
    }

    @Override
    public List<String> searchForSong(String search) {
        Criteria criteria = new Criteria("name").contains(search)
                .or("artist").contains(search);
        CriteriaQuery query = new CriteriaQuery(criteria);

        SearchHits<ElasticsearchSongEntity> songs = elasticsearchOperations.search(query, ElasticsearchSongEntity.class, IndexCoordinates.of(SONG_INDEX));
        System.out.println(songs);
        return songs
                .getSearchHits()
                .stream()
                .map(SearchHit::getContent)
                .map(ElasticsearchSongEntity::getId)
                .map(UUID::toString)
                .toList();
    }

    @Override
    public String deleteSongIndex(UUID id) {
        return elasticsearchOperations.delete(id.toString(), IndexCoordinates.of(SONG_INDEX));
    }
}
