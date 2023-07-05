package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.exceptions.NoSuchPlaylistException;
import trading.bootcamp.project.exceptions.NoSuchSongException;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.services.SongService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService service;

    @GetMapping("/user/{userId}")
    public List<SongEntity> getAllSongsByUser(@PathVariable UUID userId) {
        return service.getSongsByUser(userId);
    }

    @GetMapping("/id/{id}")
    public SongEntity getById(@PathVariable("id") UUID id) throws NoSuchPlaylistException, NoSuchSongException {
        return service.getSongById(id);
    }

    @PostMapping
    public SongEntity createPlaylist(@RequestBody SongInput song) {
        return service.addSong(song);
    }

    @DeleteMapping("{id}")
    public SongEntity deletePlaylist(@PathVariable("id") UUID id) throws NoSuchPlaylistException, NoSuchSongException {
        return service.deleteSong(id);
    }
}
