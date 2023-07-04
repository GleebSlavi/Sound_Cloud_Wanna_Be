package trading.bootcamp.project.repositories;

import trading.bootcamp.project.repositories.entities.UserEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    List<UserEntity> listUsers();

    Optional<UserEntity> getUserById(UUID id);

    Optional<UserEntity> getUserByEmail(String email);

    Optional<UserEntity> getUserByUsername(String username);

    int createUser(UUID id, String username, String email, String password, LocalDate createDate);

    int deleteUser(UUID id);
}
