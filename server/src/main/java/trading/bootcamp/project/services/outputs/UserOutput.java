package trading.bootcamp.project.services.outputs;

import trading.bootcamp.project.repositories.entities.enums.Role;

import java.util.UUID;

public record UserOutput (UUID id, String username, String imageUrl, Boolean isPremium, Integer leftSongs, Role role) {}
