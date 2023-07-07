package trading.bootcamp.project.repositories.entities.sqls;

import trading.bootcamp.project.repositories.entities.enums.Genre;

import java.time.LocalDate;
import java.util.UUID;

public record SongEntity(UUID id, UUID userId, String name, String artist, Integer releaseYear,
                         Genre genre, LocalDate uploadDate, String imageUrl, String cloudUrl) {}
