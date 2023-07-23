package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.exceptions.*;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.sqls.UserEntity;
import trading.bootcamp.project.services.UserService;
import trading.bootcamp.project.services.outputs.PlaylistOutput;
import trading.bootcamp.project.services.outputs.UserOutput;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping
    public List<UserOutput> getAllUsers() {
        return service.getUsers();
    }

    @GetMapping("{id}")
    public UserOutput getById(@PathVariable("id") UUID id) throws NoSuchUserException {
        return service.getUserById(id);
    }

    @PatchMapping("{id}")
    public ResponseEntity<Void> updateUser(@PathVariable("id") UUID id, @RequestBody UserInput user) {
        try {
            service.updateUser(id, user);
            return ResponseEntity.ok().build();
        } catch (NoSuchUserException ex) {
            return ResponseEntity.notFound().build();
        } catch (InvalidFieldException ex) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("{id}")
    public UserEntity deleteUser(@PathVariable("id") UUID id) throws NoSuchUserException {
        return service.deleteUser(id);
    }

    @GetMapping("/{userId}/playlists")
    public List<PlaylistOutput> getUserFavouritePlaylists(@PathVariable("userId") UUID userId) {
        return service.getUserFavouritePlaylists(userId);
    }
}
