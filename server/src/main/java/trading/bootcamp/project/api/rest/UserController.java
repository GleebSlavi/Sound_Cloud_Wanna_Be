package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.exceptions.*;
import trading.bootcamp.project.repositories.entities.UserEntity;
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

    @GetMapping("/{id}")
    public UserOutput getById(@PathVariable("id") UUID id) throws NoSuchUserException {
        return service.getUserById(id);
    }

    @GetMapping("/search/{search}")
    public List<UserOutput> searchForUsers(@PathVariable("search") String search) {
        return service.searchForUsers(search);
    }

    @PatchMapping("/{id}")
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

    @DeleteMapping("/{id}")
    public UserOutput deleteUser(@PathVariable("id") UUID id) throws NoSuchUserException {
        return service.deleteUser(id);
    }

    @GetMapping("/{userId}/playlists")
    public List<PlaylistOutput> getUserFavouritePlaylists(@PathVariable("userId") UUID userId,
                                                          @RequestParam("offset") Integer offset,
                                                          @RequestParam("limit") Integer limit) {
        System.out.println(offset);
        System.out.println(limit);
        return service.getUserFavouritePlaylists(userId, offset, limit);
    }

    @GetMapping("/{userId}/favorite/{playlistId}")
    public boolean isFavoritePlaylistOfUser(@PathVariable("playlistId") UUID playlistId,
                                            @PathVariable("userId") UUID userId) {
        return service.isFavoritePlaylistOfUser(playlistId, userId);
    }

    @PostMapping("/{userId}/favorite/{playlistId}")
    public void addToFavorites(@PathVariable("playlistId") UUID playlistId,
                               @PathVariable("userId") UUID userId) {
        service.addToFavorites(playlistId, userId);
    }

    @DeleteMapping("/{userId}/favorite/{playlistId}")
    public void removeFromFavorites(@PathVariable("playlistId") UUID playlistId,
                                       @PathVariable("userId") UUID userId) {
        service.removeFromFavorites(playlistId, userId);
    }
}
