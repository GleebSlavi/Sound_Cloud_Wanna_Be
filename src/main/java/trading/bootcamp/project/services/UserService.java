package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.auth.services.AuthenticationService;
import trading.bootcamp.project.exceptions.*;
import trading.bootcamp.project.repositories.UserRepository;
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

    public UserEntity addUser(UserInput userInput) throws NullUserDetailsException, InvalidPasswordException, InvalidEmailException {
        String email = userInput.getEmail();
        String password = userInput.getPassword();
        String username = userInput.getUsername();

        if (username == null || email == null || password == null) {
            throw new NullUserDetailsException("Email, username and password can not be null");
        }

        if (username.isBlank() || username.strip().length() < 3) {
            throw new InvalidUsernameException("Username can't be less than 3 symbols");
        }

        if (AuthenticationService.isInvalidEmail(email)) {
            throw new InvalidEmailException("Invalid email");
        }

        if (password.isBlank() || password.length() < 8) {
            throw new InvalidPasswordException("Password must be 8 or more symbols");
        }

        UserEntity user = Mappers.fromUserInput(userInput);
        if (repository.createUser(user.getId(), user.getUsername(), email,
            passwordEncoder.encode(password), user.getCreateDate(), user.getImageUrl()) != 1) {
            throw new IllegalStateException("Couldn't insert the user");
        }
        return user;
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

    public List<UUID> getUserFavouritePlaylistsIDs(UUID userId) {
        return repository.getUserFavouritePlaylistsIDs(userId);
    }
}
