package trading.bootcamp.project.repositories;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import trading.bootcamp.project.repositories.entities.ElasticsearchUserEntity;

import java.util.List;
import java.util.UUID;

public interface ElasticsearchUserRepository{

    String createUserIndex(ElasticsearchUserEntity user);

    List<String> searchForUser(String search);

    String deleteUserIndex(UUID id);
}
