package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.exceptions.InvalidFieldException;
import trading.bootcamp.project.exceptions.NoSuchSongException;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.services.SongService;
import trading.bootcamp.project.services.outputs.PlaylistOutput;
import trading.bootcamp.project.services.outputs.SongOutput;

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

    @GetMapping("/search/{search}")
    public List<SongOutput> searchForSongs(@PathVariable("search") String search) {
        return service.searchForSongs(search);
    }

    @GetMapping("/id/{id}")
    public SongEntity getById(@PathVariable("id") UUID id) throws NoSuchSongException {
        return service.getSongById(id);
    }

    @PostMapping
    public ResponseEntity<SongOutput> addSong(@RequestBody SongInput song) {
        try {
            return ResponseEntity.ok(service.addSong(song));
        } catch (InvalidFieldException ex) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("{id}")
    public SongOutput deletePlaylist(@PathVariable("id") UUID id) throws NoSuchSongException {
        return service.deleteSong(id);
    }
}
