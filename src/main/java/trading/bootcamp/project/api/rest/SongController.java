package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.exceptions.NoSuchPlaylistException;
import trading.bootcamp.project.exceptions.NoSuchSongException;
import trading.bootcamp.project.repositories.ElasticsearchSongRepository;
import trading.bootcamp.project.repositories.entities.sqls.SongEntity;
import trading.bootcamp.project.services.SongService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService service;

    private final ElasticsearchSongRepository elasticsearchSongRepository;

    @GetMapping("/user/{userId}")
    public List<SongEntity> getAllSongsByUser(@PathVariable UUID userId) {
        return service.getSongsByUser(userId);
    }

    @GetMapping("/name/{name}")
    public List<SongEntity> getAllSongsByName(@PathVariable String name) {
        return service.getSongsByTerm(name, elasticsearchSongRepository::searchSongsByName);
    }

    @GetMapping("/artist/{artist}")
    public List<SongEntity> getAllSongsByArtist(@PathVariable String artist) {
        return service.getSongsByTerm(artist, elasticsearchSongRepository::searchSongsByArtist));
    }

    @GetMapping("/genre/{genre}")
    public List<SongEntity> getAllSongsByGenre(@PathVariable String genre) {
        return service.getSongsByTerm(genre, elasticsearchSongRepository::searchSongsByGenre);
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
