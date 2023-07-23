package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.auth.services.AuthenticationService;
import trading.bootcamp.project.exceptions.*;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.sqls.UserEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String EMAIL_REGEX = "^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    private final UserRepository userRepository;

    private final PlaylistRepository playlistRepository;

    private final PasswordEncoder passwordEncoder;

    public List<UserEntity> getUsers() {
        return userRepository.listUsers();
    }

    public UserEntity getUserById(UUID id) throws NoSuchUserException {
        Optional<UserEntity> user = userRepository.getUserById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with id %s not found", id.toString()));
        }
        return user.get();
    }

    public UserEntity getUserByUsername(String username) throws NoSuchUserException {
        Optional<UserEntity> user = userRepository.getUserByUsername(username);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with username %s not found", username));
        }
        return user.get();
    }

    public void updateUser(UUID id, UserInput inputUser) {
        Optional<UserEntity> user = userRepository.getUserById(id);
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

            if(userRepository.updateUserPassword(id, passwordEncoder.encode(inputUser.getNewPassword())) != 1) {
                throw new IllegalStateException("Couldn't update the user");
            }
        }

        if (inputUser.getImageUrl() != null) {
            if (userRepository.updateUserImageUrl(id, inputUser.getImageUrl()) != 1) {
                throw new IllegalStateException("Couldn't update the user");
            }
        }
    }

    private boolean isInvalidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        return !pattern.matcher(email).matches();
    }

    public UserEntity addUser(UserInput userInput) {
        String email = userInput.getEmail();
        String password = userInput.getNewPassword();
        String username = userInput.getUsername();

        if (username.isBlank() || username.strip().length() < 4) {
            throw new InvalidFieldException("Username can't be less than 4 symbols");
        }

        if (isInvalidEmail(email)) {
            throw new InvalidFieldException("Invalid email");
        }

        if (password.isBlank() || password.length() < 8) {
            throw new InvalidFieldException("Password must be 8 or more symbols");
        }

        UserEntity user = Mappers.fromUserInput(userInput);
        if (userRepository.createUser(user.getId(), user.getUsername(), user.getEmail(), user.getPassword(), user.getCreateDate(), user.getImageUrl()) != 1) {
            throw new IllegalStateException("Couldn't create all songs playlist");
        }

        UUID playlistId = UUID.randomUUID();
        if (playlistRepository.createPlaylist(playlistId, user.getId(), "All songs", "Playlist that consists of all uploaded songs",
            true, LocalDate.now(), PlaylistType.PUBLIC, null) != 1) {
            userRepository.deleteUser(user.getId());
            throw new IllegalStateException("Couldn't create all songs playlist");
        }

        if (userRepository.insertFavoritePlaylist(user.getId(), playlistId) != 1) {
            userRepository.deleteUser(user.getId());
            playlistRepository.deletePlaylist(playlistId);
            throw new IllegalStateException("Couldn't add the favorite playlist");
        }

        return user;
    }

    public UserEntity deleteUser(UUID id) throws NoSuchUserException {
        Optional<UserEntity> user = userRepository.getUserById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with id %s not found", id.toString()));
        }

        if (userRepository.deleteUser(id) != 1) {
            throw new IllegalStateException("Couldn't delete the user");
        }
        return user.get();
    }


    public List<PlaylistEntity> getUserFavouritePlaylists(UUID userId) {
        return userRepository.getUserFavouritePlaylists(userId);
    }
}
