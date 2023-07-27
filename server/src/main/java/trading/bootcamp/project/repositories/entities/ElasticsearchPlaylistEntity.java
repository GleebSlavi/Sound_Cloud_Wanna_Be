package trading.bootcamp.project.repositories.entities;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;

import java.util.UUID;

@Document(indexName = "playlist")
@Data
@RequiredArgsConstructor
public class ElasticsearchPlaylistEntity {

    @Id
    @Field(type = FieldType.Keyword)
    private final UUID id;

    @Field(type = FieldType.Text, name = "name")
    private final String name;

    @Field(type = FieldType.Text, name = "type")
    private final PlaylistType type;
}
