package trading.bootcamp.project.services.elasticsearch;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.*;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.repositories.entities.elasticsearch.ElasticsearchUserEntity;

import java.util.List;
import java.util.UUID;

@Service
public class UserSearchService {

    private static final String USER_INDEX = "user";

    private ElasticsearchOperations elasticsearchOperations;

    public String createProductIndex(ElasticsearchUserEntity user) {
        IndexQuery indexQuery = new IndexQueryBuilder()
                .withId(user.getId().toString())
                .withObject(user).build();

        String documentId = elasticsearchOperations.index(indexQuery, IndexCoordinates.of(USER_INDEX));
        return documentId;
    }

    public List<UUID> findByUsername(String username) {
        CriteriaQuery query = new CriteriaQuery(new Criteria("username").contains(username));

        SearchHits<ElasticsearchUserEntity> users = elasticsearchOperations
                .search(query, ElasticsearchUserEntity.class, IndexCoordinates.of(USER_INDEX))
                .stream()
                .map(ElasticsearchUserEntity::getId)
                .toList();
    }
}
