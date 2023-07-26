package trading.bootcamp.project.repositories.entities.elasticsearch;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.UUID;

@Document(indexName = "user")
@Data
@RequiredArgsConstructor
public class ElasticsearchUserEntity {

    @Id
    @Field(type = FieldType.Keyword)
    private final UUID id;

    @Field(type = FieldType.Text, name = "username")
    private final String username;
}
