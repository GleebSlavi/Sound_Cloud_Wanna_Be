package trading.bootcamp.project.repositories.entities;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.UUID;

@Document(indexName = "song")
@Data
@RequiredArgsConstructor
public class ElasticsearchSongEntity {

    @Id
    @Field(type = FieldType.Keyword)
    private final UUID id;

    @Field(type = FieldType.Text, name = "name")
    private final String name;

    @Field(type = FieldType.Text, name = "artist")
    private final String artist;
}
