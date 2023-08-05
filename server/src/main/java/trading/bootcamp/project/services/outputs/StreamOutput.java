package trading.bootcamp.project.services.outputs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import trading.bootcamp.project.api.rest.inputs.StreamInput;

import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class StreamOutput {

    private final UUID streamId;

    private UUID songId;

    private final String ownerUsername;

    private String ownerImageUrl;

    private String songName;

    private String songArtist;

    private Integer listeners;

    public StreamOutput updateStream(String songName, String songArtist, Integer listeners, UUID songId, String ownerImageUrl) {
        if (songName != null && songArtist != null && songId != null) {
            this.songArtist = songArtist;
            this.songName = songName;
            this.songId = songId;
        }

        if (listeners != null) {
            this.listeners = listeners;
        }

        if (ownerImageUrl != null) {
            this.ownerImageUrl = ownerImageUrl;
        }
        return this;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        StreamOutput stream = (StreamOutput) obj;
        return streamId.equals(stream.streamId);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(streamId);
    }
}
