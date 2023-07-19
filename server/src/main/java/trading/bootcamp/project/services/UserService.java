package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.auth.services.AuthenticationService;
import trading.bootcamp.project.exceptions.*;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.sqls.UserEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    public List<UserEntity> getUsers() {
        return repository.listUsers();
    }

    public UserEntity getUserById(UUID id) throws NoSuchUserException {
        Optional<UserEntity> user = repository.getUserById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with id %s not found", id.toString()));
        }
        return user.get();
    }

    public UserEntity getUserByUsername(String username) throws NoSuchUserException {
        Optional<UserEntity> user = repository.getUserByUsername(username);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with username %s not found", username));
        }
        return user.get();
    }

    public UserEntity getUserByEmail(String email) throws NoSuchUserException {
        Optional<UserEntity> user = repository.getUserByEmail(email);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with email %s not found", email));
        }
        return user.get();
    }

    public void updateUser(UUID id, UserInput inputUser) {
        Optional<UserEntity> user = repository.getUserById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException("There is no user with such id");
        }

        if (inputUser.getOldPassword() != null && inputUser.getNewPassword() != null) {
            if (!passwordEncoder.matches(inputUser.getOldPassword(), user.get().getPassword())) {
                throw new InvalidFieldException("Passwords don't match");
            }

            if (inputUser.getNewPassword().strip().length() < 8) {
                throw new InvalidFieldException("New password must be more than 7 characters!");
            }

            if(repository.updateUserPassword(id, passwordEncoder.encode(inputUser.getNewPassword())) != 1) {
                throw new IllegalStateException("Couldn't update the user");
            }
        }

        if (inputUser.getImageUrl() != null) {
            if (repository.updateUserImageUrl(id, inputUser.getImageUrl()) != 1) {
                throw new IllegalStateException("Couldn't update the user");
            }
        }
    }

    public UserEntity deleteUser(UUID id) throws NoSuchUserException {
        Optional<UserEntity> user = repository.getUserById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with id %s not found", id.toString()));
        }

        if (repository.deleteUser(id) != 1) {
            throw new IllegalStateException("Couldn't delete the user");
        }
        return user.get();
    }


    public List<PlaylistEntity> getUserFavouritePlaylists(UUID userId) {
        return repository.getUserFavouritePlaylists(userId);
    }
}
