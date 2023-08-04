package trading.bootcamp.project.repositories.entities;

import trading.bootcamp.project.repositories.entities.enums.PlaylistType;

import java.time.LocalDate;
import java.util.UUID;

public record PlaylistEntity(UUID id, UUID userId, String name, String description, Boolean isAllSongs, LocalDate createDate, PlaylistType type, String imageUrl) {}
