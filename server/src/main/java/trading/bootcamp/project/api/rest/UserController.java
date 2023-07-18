package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.exceptions.InvalidEmailException;
import trading.bootcamp.project.exceptions.InvalidPasswordException;
import trading.bootcamp.project.exceptions.NullUserDetailsException;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.sqls.UserEntity;
import trading.bootcamp.project.exceptions.NoSuchUserException;
import trading.bootcamp.project.services.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping
    public List<UserEntity> getAllUsers() {
        return service.getUsers();
    }

    @GetMapping("{id}")
    public UserEntity getById(@PathVariable("id") UUID id) throws NoSuchUserException {
        return service.getUserById(id);
    }

    @PostMapping
    public UserEntity createUser(@RequestBody UserInput user) throws NullUserDetailsException, InvalidPasswordException, InvalidEmailException {
        return service.addUser(user);
    }

    @DeleteMapping("{id}")
    public UserEntity deleteUser(@PathVariable("id") UUID id) throws NoSuchUserException {
        return service.deleteUser(id);
    }

    @GetMapping("/{userId}/playlists")
    public List<PlaylistEntity> getUserFavouritePlaylists(@PathVariable("userId") UUID userId) {
        return service.getUserFavouritePlaylists(userId);
    }
}
