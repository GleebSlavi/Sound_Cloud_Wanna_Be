package trading.bootcamp.project.api.rest.inputs;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import trading.bootcamp.project.repositories.entities.enums.SongType;

import java.util.UUID;

@Data
public class SongInput {
    private final UUID userid;

    private final String name;

    private final String artist;

    private final Integer releaseYear;

    private final Double duration;

    private final SongType type;

    private final String imageUrl;

    private final String cloudUrl;

    @JsonCreator
    public SongInput(@JsonProperty("userId") String userId,
                     @JsonProperty("name") String name,
                     @JsonProperty("artist") String artist,
                     @JsonProperty("releaseYear") Integer releaseYear,
                     @JsonProperty("duration") Double duration,
                     @JsonProperty("type") String type,
                     @JsonProperty("imageUrl") String imageUrl,
                     @JsonProperty("cloudUrl") String cloudUrl) {
        this.userid = UUID.fromString(userId);
        this.name = name;
        this.artist = artist;
        this.releaseYear = releaseYear;
        this.duration = duration;
        this.type = SongType.valueOf(type);
        this.imageUrl = imageUrl;
        this.cloudUrl = cloudUrl;
    }

}
