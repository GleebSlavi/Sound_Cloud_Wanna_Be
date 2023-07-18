package trading.bootcamp.project.api.rest.inputs;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;

import java.util.UUID;

@Data
public class PlaylistInput {

    private final UUID userId;

    private final String name;

    private final String description;

    private final PlaylistType type;

    private final String imageUrl;

    @JsonCreator
    public PlaylistInput(@JsonProperty("userId") String userId,
                         @JsonProperty("name") String name,
                         @JsonProperty("description") String description,
                         @JsonProperty("type") String type,
                         @JsonProperty("imageUrl") String imageUrl) {
        this.userId = UUID.fromString(userId);
        this.name = name;
        this.description = description;
        this.type = PlaylistType.valueOf(type);
        this.imageUrl = imageUrl;
    }
}
