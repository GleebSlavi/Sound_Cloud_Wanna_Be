package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.PlaylistInput;
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

    @GetMapping("/user/{userId}")
    public List<PlaylistEntity> getAllPlaylistsByUser(@PathVariable("userId") UUID userId) {
        return service.getPlaylistsByUser(userId);
    }

    @GetMapping("/id/{id}")
    public PlaylistEntity getById(@PathVariable("id") UUID id) throws NoSuchPlaylistException {
        return service.getPlaylistById(id);
    }

    @PostMapping
    public PlaylistEntity createPlaylist(@RequestBody PlaylistInput playlist) {
        return service.addPlaylist(playlist);
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
