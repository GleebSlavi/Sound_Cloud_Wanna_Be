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
import trading.bootcamp.project.repositories.ElasticsearchUserRepository;
import trading.bootcamp.project.repositories.entities.ElasticsearchUserEntity;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ElasticsearchUserRepositoryImpl implements ElasticsearchUserRepository {

    private static final String USER_INDEX = "user";

    private final ElasticsearchOperations elasticsearchOperations;


    @Override
    public String createUserIndex(ElasticsearchUserEntity user) {
        IndexQuery indexQuery = new IndexQueryBuilder()
                .withId(user.getId().toString())
                .withObject(user)
                .build();

        return elasticsearchOperations.index(indexQuery, IndexCoordinates.of(USER_INDEX));
    }

    @Override
    public List<String> searchForUser(String search) {
        Criteria criteria = new Criteria("username").contains(search);
        CriteriaQuery query = new CriteriaQuery(criteria);

        SearchHits<ElasticsearchUserEntity> users = elasticsearchOperations.search(query, ElasticsearchUserEntity.class, IndexCoordinates.of(USER_INDEX));

        return users
                .getSearchHits()
                .stream()
                .map(SearchHit::getContent)
                .map(ElasticsearchUserEntity::getId)
                .map(UUID::toString)
                .toList();
    }

}
