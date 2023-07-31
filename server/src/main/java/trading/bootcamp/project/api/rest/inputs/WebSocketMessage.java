package trading.bootcamp.project.api.rest.inputs;



public record WebSocketMessage(boolean isPlaying, String songUrl, Double currentTime, String songName, String songArtist, String songImageUrl) {}
