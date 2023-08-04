package trading.bootcamp.project.auth.services;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.auth.requests.AuthenticationRequest;
import trading.bootcamp.project.auth.requests.RegisterRequest;
import trading.bootcamp.project.auth.responses.AuthenticationResponse;
import trading.bootcamp.project.repositories.entities.UserEntity;
import trading.bootcamp.project.services.UserService;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        UserEntity user = userService.addUser(new UserInput(request.getEmail(), request.getUsername(),
            null, request.getPassword(), null, false, 4));

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
        UserEntity user = userService.getUserByUsername(username);

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .build();
    }
}
