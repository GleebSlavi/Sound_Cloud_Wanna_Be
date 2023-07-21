package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.exceptions.InvalidFieldException;
import trading.bootcamp.project.exceptions.NoSuchSongException;
import trading.bootcamp.project.repositories.entities.sqls.SongEntity;
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

    @GetMapping("/name/{name}")
    public List<SongEntity> getAllSongsByName(@PathVariable String name) {
        return service.getSongsByTerm(name, "name");
    }

    @GetMapping("/artist/{artist}")
    public List<SongEntity> getAllSongsByArtist(@PathVariable String artist) {
        return service.getSongsByTerm(artist, "artist");
    }

    @GetMapping("/genre/{genre}")
    public List<SongEntity> getAllSongsByGenre(@PathVariable String genre) {
        return service.getSongsByTerm(genre, "genre");
    }

    @GetMapping("/id/{id}")
    public SongEntity getById(@PathVariable("id") UUID id) throws NoSuchSongException {
        return service.getSongById(id);
    }

    @PostMapping
    public ResponseEntity<SongEntity> addSong(@RequestBody SongInput song) {
        try {
            return ResponseEntity.ok(service.addSong(song));
        } catch (InvalidFieldException ex) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("{id}")
    public SongEntity deletePlaylist(@PathVariable("id") UUID id) throws NoSuchSongException {
        return service.deleteSong(id);
    }
}
