package trading.bootcamp.project.repositories.entities;

import java.time.LocalDate;
import java.util.UUID;

public record SongEntity(UUID id, UUID userId, String name, String artist, Integer releaseYear, Double duration,
                         LocalDate uploadDate, String imageUrl, String cloudUrl) {}
