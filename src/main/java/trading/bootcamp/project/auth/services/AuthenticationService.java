package trading.bootcamp.project.auth.services;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.auth.requests.AuthenticationRequest;
import trading.bootcamp.project.auth.requests.RegisterRequest;
import trading.bootcamp.project.auth.responses.AuthenticationResponse;
import trading.bootcamp.project.exceptions.InvalidEmailException;
import trading.bootcamp.project.exceptions.InvalidPasswordException;
import trading.bootcamp.project.exceptions.NoSuchUserException;
import trading.bootcamp.project.exceptions.NullUserDetailsException;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.UserEntity;

import java.time.LocalDate;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public static boolean isInvalidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        return !pattern.matcher(email).matches();
    }

    public AuthenticationResponse register(RegisterRequest request) throws InvalidPasswordException, NullUserDetailsException, InvalidEmailException {
        String email = request.getEmail();
        String password = request.getPassword();

        if (request.getUsername() == null || email == null || password == null) {
            throw new NullUserDetailsException("Email, username and password can not be null");
        }

        if (isInvalidEmail(email)) {
            throw new InvalidEmailException("Invalid email");
        }

        if (password.isBlank() || password.length() < 8) {
            throw new InvalidPasswordException("Password must be 8 or more symbols");
        }

        UserEntity user = new UserEntity(UUID.randomUUID(), request.getUsername(),
                email, passwordEncoder.encode(password), LocalDate.now(), null);
        userRepository.createUser(user.getId(), user.getUsername(),
                user.getEmail(), user.getPassword(), user.getCreateDate(), user.getImageUrl());

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws NullUserDetailsException, NoSuchUserException {
        String username = request.getUsername();
        String password = request.getPassword();

        if (username == null || password == null) {
            throw new NullUserDetailsException("Email or password are null");
        }

        new UsernamePasswordAuthenticationToken(username, password);
        UserEntity user = userRepository.getUserByUsername(username)
                .orElseThrow(() -> new NoSuchUserException("User not found"));

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
