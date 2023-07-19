package trading.bootcamp.project.auth.services;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.auth.requests.AuthenticationRequest;
import trading.bootcamp.project.auth.requests.RegisterRequest;
import trading.bootcamp.project.auth.responses.AuthenticationResponse;
import trading.bootcamp.project.exceptions.*;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.enums.PlaylistType;
import trading.bootcamp.project.repositories.entities.sqls.UserEntity;

import java.time.LocalDate;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final String EMAIL_REGEX = "^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    private final UserRepository userRepository;

    private final PlaylistRepository playlistRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public static boolean isInvalidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        return !pattern.matcher(email).matches();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String username = request.getUsername();

        if (username.isBlank() || username.strip().length() < 4) {
            throw new InvalidFieldException("Username can't be less than 4 symbols");
        }

        if (isInvalidEmail(email)) {
            throw new InvalidFieldException("Invalid email");
        }

        if (password.isBlank() || password.length() < 8) {
            throw new InvalidFieldException("Password must be 8 or more symbols");
        }

        UserEntity user = new UserEntity(UUID.randomUUID(), request.getUsername(),
                email, passwordEncoder.encode(password), LocalDate.now(), null);

        if (userRepository.createUser(user.getId(), user.getUsername(),
                user.getEmail(), user.getPassword(), user.getCreateDate(), user.getImageUrl()) != 1) {
            throw new IllegalStateException("Couldn't create the user");
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


        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        UserEntity user = userRepository.getUserByUsername(username)
                .orElseThrow(() -> new NoSuchUserException("User not found"));

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .build();
    }
}
