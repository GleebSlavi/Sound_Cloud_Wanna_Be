package trading.bootcamp.project.services.outputs;


import java.time.LocalDate;
import java.util.UUID;

public record SongOutput(UUID id, UUID userId, String name, String artist, Integer releaseYear, Double duration,
                        LocalDate uploadDate, String imageUrl, String cloudUrl, String username) {}
