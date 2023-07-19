package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.PlaylistInput;
import trading.bootcamp.project.exceptions.InvalidFieldException;
import trading.bootcamp.project.exceptions.NoSuchPlaylistException;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.services.PlaylistService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService service;

    @GetMapping("/users/{user-id}/{playlist-name}")
    public ResponseEntity<Void> getPlaylistByNameAndUserId(@PathVariable("user-id") UUID userId,
                                                     @PathVariable("playlist-name") String playlistName) {
        return service.getPlaylistByNameAndUserId(userId, playlistName) != null ?
                ResponseEntity.ok().build() :
                ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public List<PlaylistEntity> getAllPlaylistsByUser(@PathVariable("userId") UUID userId) {
        return service.getPlaylistsByUser(userId);
    }

    @GetMapping("name/{name}")
    public PlaylistEntity getByName(@PathVariable("name") String name) {
        return service.getPlaylistByName(name);
    }

    @GetMapping("/id/{id}")
    public PlaylistEntity getById(@PathVariable("id") UUID id) throws NoSuchPlaylistException {
        return service.getPlaylistById(id);
    }

    @PostMapping
    public ResponseEntity<PlaylistEntity> createPlaylist(@RequestBody PlaylistInput playlist) {
        try {
            return ResponseEntity.ok(service.addPlaylist(playlist));
        } catch (InvalidFieldException ex) {
            return ResponseEntity.badRequest().body(null);
        } catch (IllegalStateException ex) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @DeleteMapping("{id}")
    public PlaylistEntity deletePlaylist(@PathVariable("id") UUID id) throws NoSuchPlaylistException {
        return service.deletePlaylist(id);
    }

    @GetMapping("songs/{playlistId}")
    public List<UUID> getSongsInPlaylistIDs(@PathVariable("playlistId") UUID playlistId) {
        return service.getSongsInPlaylistIDs(playlistId);
    }
}
