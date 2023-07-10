package trading.bootcamp.project.repositories.entities.searches;

import org.springframework.data.elasticsearch.annotations.Document;
import trading.bootcamp.project.repositories.entities.enums.Genre;

import java.util.UUID;

@Document(indexName = "song")
public record ElasticsearchSongEntity(UUID id, String name, String artist, Genre genre) {}
