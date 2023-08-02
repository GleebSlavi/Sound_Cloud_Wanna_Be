package trading.bootcamp.project.api.rest.inputs;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Objects;
import java.util.UUID;

@Data
public class StreamInput {

    private final UUID streamId;

    private final UUID songId;

    private final UUID ownerId;

    private final String songName;

    private final String songArtist;

    private final Integer listeners;

    @JsonCreator
    public StreamInput(@JsonProperty("streamId") String streamId,
                       @JsonProperty("songId") String songId,
                       @JsonProperty("ownerId") String ownerId,
                       @JsonProperty("songName") String songName,
                       @JsonProperty("songArtist") String songArtist,
                       @JsonProperty("listeners") Integer listeners) {
        this.streamId = UUID.fromString(streamId);
        this.songId = UUID.fromString(songId);
        this.ownerId = UUID.fromString(ownerId);
        this.songName = songName;
        this.songArtist = songArtist;
        this.listeners = listeners;
    }
}
