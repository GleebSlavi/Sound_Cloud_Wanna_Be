package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.exceptions.NoSuchSongException;
import trading.bootcamp.project.repositories.SongRepository;
import trading.bootcamp.project.repositories.entities.SongEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository repository;

    public List<SongEntity> getSongsByUser(UUID userId) {
        return repository.listSongsByUser(userId);
    }

    public SongEntity getSongById(UUID id) throws NoSuchSongException {
        Optional<SongEntity> song = repository.getSongById(id);
        if (song.isEmpty()) {
            throw new NoSuchSongException(String.format("Song with id %s not found", id.toString()));
        }
        return song.get();
    }

    public SongEntity addSong(SongInput songInput) {
        SongEntity song = Mappers.fromSongInput(songInput);
        if (repository.createSong(song.id(), song.userId(), song.name(),
            song.artist(), song.releaseYear(), song.genre(), song.uploadDate(),
            song.imageUrl(), song.cloudUrl()) != 1) {
            throw new IllegalStateException("Couldn't insert the song");
        }

        return song;
    }

    public SongEntity deleteSong(UUID id) throws NoSuchSongException {
        Optional<SongEntity> song = repository.getSongById(id);
        if (song.isEmpty()) {
            throw new NoSuchSongException(String.format("Song with id %s not found", id.toString()));
        }

        if (repository.deleteSong(id) != 1) {
            throw new IllegalStateException("Couldn't delete the song");
        }
        return song.get();
    }


}
