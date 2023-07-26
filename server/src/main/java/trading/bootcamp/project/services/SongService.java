package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.exceptions.InvalidSongNameException;
import trading.bootcamp.project.exceptions.NoSuchSongException;
import trading.bootcamp.project.repositories.ElasticsearchSongRepository;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.SongRepository;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.sqls.SongEntity;
import trading.bootcamp.project.services.mappers.InputMappers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;

    private final PlaylistRepository playlistRepository;

    private final ElasticsearchSongRepository elasticsearchSongRepository;

    public List<SongEntity> getSongsByUser(UUID userId) {
        return songRepository.listSongsByUser(userId);
    }

    public List<SongEntity> getSongsByTerm(String term, String field) {
        return elasticsearchSongRepository.searchSongsByTerm(field, term)
            .stream()
            .map(songRepository::getSongById)
            .flatMap(Optional::stream)
            .toList();
    }

    public SongEntity getSongById(UUID id) throws NoSuchSongException {
        Optional<SongEntity> song = songRepository.getSongById(id);
        if (song.isEmpty()) {
            throw new NoSuchSongException(String.format("Song with id %s not found", id.toString()));
        }
        return song.get();
    }

    public SongEntity addSong(SongInput songInput) {
        if (songInput.getName().strip().length() < 1 || songInput.getArtist().strip().length() < 1) {
            throw new InvalidSongNameException("Song name and artist can't be less than 1 character");
        }

        SongEntity song = InputMappers.fromSongInput(songInput);
        if (songRepository.createSong(song.id(), song.userId(), song.name(),
            song.artist(), song.releaseYear(), song.duration(), song.type(), song.uploadDate(),
            song.imageUrl(), song.cloudUrl()) != 1) {
            throw new IllegalStateException("Couldn't insert the song");
        }

        Optional<PlaylistEntity> allSongsPlaylist = playlistRepository.getAllSongsPlaylist(song.userId());
        allSongsPlaylist.ifPresent(playlistEntity -> songRepository.addSongToPlaylist(playlistEntity.id(), song.id()));

        return song;
    }

    public SongEntity deleteSong(UUID id) throws NoSuchSongException {
        Optional<SongEntity> song = songRepository.getSongById(id);
        if (song.isEmpty()) {
            throw new NoSuchSongException(String.format("Song with id %s not found", id.toString()));
        }

        if (songRepository.deleteSong(id) != 1) {
            throw new IllegalStateException("Couldn't delete the song");
        }
        elasticsearchSongRepository.deleteSong(id);

        return song.get();
    }


}
