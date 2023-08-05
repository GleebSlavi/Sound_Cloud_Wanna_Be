package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import trading.bootcamp.project.api.rest.ToOutputMappers;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.exceptions.*;
import trading.bootcamp.project.repositories.ElasticsearchUserRepository;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.ElasticsearchUserEntity;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;
import trading.bootcamp.project.repositories.entities.UserEntity;
import trading.bootcamp.project.services.outputs.PlaylistOutput;
import trading.bootcamp.project.services.outputs.UserOutput;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private static final Integer LEFT_SONGS = 4;
    private static final String EMAIL_REGEX = "^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    private final UserRepository userRepository;

    private final PlaylistRepository playlistRepository;

    private final PasswordEncoder passwordEncoder;

    private final ElasticsearchUserRepository searchRepository;

    public List<UserOutput> getUsers() {
        return userRepository.listUsers()
            .stream()
            .map(ToOutputMappers::toUserOutput)
            .toList();
    }

    public List<UserOutput> searchForUsers(String search) {
        try {
            List<String> ids = searchRepository.searchForUser(search);

            return !ids.isEmpty()
                    ? userRepository.searchForUsers(ids)
                    .stream()
                    .map(ToOutputMappers::toUserOutput)
                    .toList()
                    : Collections.emptyList();

        } catch (NoSuchUserException e) {
            return Collections.emptyList();
        }
    }

    public UserOutput getUserById(UUID id) throws NoSuchUserException {
        Optional<UserEntity> user = userRepository.getUserById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with id %s not found", id.toString()));
        }
        return ToOutputMappers.toUserOutput(user.get());
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

        if (inputUser.getLeftSongs() != null) {
            if (userRepository.updateUserLeftSongs(id, inputUser.getLeftSongs()) != 1) {{
                throw new IllegalStateException("Couldn't update the user");
            }}
        }

        if (inputUser.getIsPremium() != null) {
            if (userRepository.updateUserPremium(id, inputUser.getIsPremium(), LocalDate.now()) != 1) {
                throw new IllegalStateException("Couldn't update the user");
            }
        }
    }

    public boolean isFavoritePlaylistOfUser(UUID playlistId, UUID userId) {
        return userRepository.isFavoritePlaylistOfUser(userId, playlistId);
    }

    public void addToFavorites(UUID playlistId, UUID userId) {
        if(userRepository.addToFavorites(userId, playlistId) != 1) {
            throw new IllegalStateException("Couldn't add to favorites");
        }
    }

    public void removeFromFavorites(UUID playlistId, UUID userId) {
        if(userRepository.removeFromFavorites(userId, playlistId) != 1) {
            throw new IllegalStateException("Couldn't remove from favorites");
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

        if (username == null || username.isBlank() || username.strip().length() < 4) {
            throw new InvalidFieldException("Username can't be less than 4 symbols");
        }

        if (isInvalidEmail(email)) {
            throw new InvalidFieldException("Invalid email");
        }

        if (password == null || password.isBlank() || password.length() < 8) {
            throw new InvalidFieldException("Password must be 8 or more symbols");
        }

        UserEntity user = ToEntityMappers.toUserEntity(userInput);
        userRepository.createUser(user.getId(), user.getUsername(), user.getEmail(), passwordEncoder.encode(user.getPassword()),
                user.getCreateDate(), user.getImageUrl(), user.getIsPremium(), user.getLeftSongs(), null);

        // Create all songs playlist and add it to favorites
        UUID playlistId = UUID.randomUUID();
        playlistRepository.createPlaylist(playlistId, user.getId(), "All songs", "Playlist that consists of all uploaded songs",
                true, LocalDate.now(), PlaylistType.PUBLIC, null);
        userRepository.insertFavoritePlaylist(user.getId(), playlistId);

        if (!searchRepository.createUserIndex(
                new ElasticsearchUserEntity(user.getId(), user.getUsername())).equals(user.getId().toString())) {
            throw new IllegalStateException("Couldn't create the index!");
        }

        return user;
    }

    public UserOutput deleteUser(UUID id) throws NoSuchUserException {
        Optional<UserEntity> user = userRepository.getUserById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException(String.format("User with id %s not found", id.toString()));
        }

        if (userRepository.deleteUser(id) != 1) {
            throw new IllegalStateException("Couldn't delete the user!");
        }

        if (!searchRepository.deleteUserIndex(id).equals(id.toString())) {
            throw new IllegalStateException("Couldn't delete the index!");
        }

        return ToOutputMappers.toUserOutput(user.get());
    }


    public List<PlaylistOutput> getUserFavouritePlaylists(UUID userId, Integer offset, Integer limit) {
        return userRepository.getUserFavouritePlaylists(userId, offset, limit)
            .stream()
            .map(playlist -> ToOutputMappers.toPlaylistOutput(userRepository, playlist))
            .toList();
    }

    @Scheduled(cron = "0 0 * * * 1")
    public void resetLeftSongs() {
        userRepository.resetLeftSongs(LEFT_SONGS);
    }

    @Scheduled(fixedRate = 30000)
    public void checkSubscriptions() {
        List<UserEntity> premiumUsers = userRepository.getAllPremiumUsers();

        for (UserEntity user : premiumUsers) {
            if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(LocalDate.now())) {
                userRepository.updateUserPremium(user.getId(), false, null);
            }
        }
    }
}
