package trading.bootcamp.project.services.outputs;

import trading.bootcamp.project.repositories.entities.enums.PlaylistType;

import java.time.LocalDate;
import java.util.UUID;

public record PlaylistOutput(UUID id, UUID userId, String name, String description, boolean isAllSongs,
                             LocalDate createDate, PlaylistType type, String imageUrl, String username) {}
