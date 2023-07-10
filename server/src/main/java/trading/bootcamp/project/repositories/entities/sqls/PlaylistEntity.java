package trading.bootcamp.project.repositories.entities.sqls;

import trading.bootcamp.project.repositories.entities.enums.Type;

import java.time.LocalDate;
import java.util.UUID;

public record PlaylistEntity(UUID id, UUID userId, String name, String description, LocalDate createDate, Type type, String imageUrl) {}
