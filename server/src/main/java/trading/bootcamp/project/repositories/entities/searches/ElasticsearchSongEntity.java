package trading.bootcamp.project.repositories.entities.searches;

import org.springframework.data.elasticsearch.annotations.Document;

import java.util.UUID;

@Document(indexName = "song")
public record ElasticsearchSongEntity(UUID id, String name, String artist) {}
