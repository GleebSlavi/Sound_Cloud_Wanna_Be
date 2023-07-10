package trading.bootcamp.project.auth.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import trading.bootcamp.project.auth.services.AuthenticationService;
import trading.bootcamp.project.auth.requests.AuthenticationRequest;
import trading.bootcamp.project.auth.requests.RegisterRequest;
import trading.bootcamp.project.auth.responses.AuthenticationResponse;
import trading.bootcamp.project.exceptions.InvalidEmailException;
import trading.bootcamp.project.exceptions.InvalidPasswordException;
import trading.bootcamp.project.exceptions.NoSuchUserException;
import trading.bootcamp.project.exceptions.NullUserDetailsException;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) throws InvalidPasswordException, NullUserDetailsException, InvalidEmailException {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) throws NullUserDetailsException, NoSuchUserException {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
