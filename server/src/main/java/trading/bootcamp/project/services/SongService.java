package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import trading.bootcamp.project.api.rest.ToOutputMappers;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.exceptions.InvalidSongNameException;
import trading.bootcamp.project.exceptions.NoSuchSongException;
import trading.bootcamp.project.repositories.ElasticsearchSongRepository;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.SongRepository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.ElasticsearchSongEntity;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.services.outputs.SongOutput;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SongService {

    private final SongRepository songRepository;

    private final PlaylistRepository playlistRepository;

    private final ElasticsearchSongRepository searchRepository;

    private final UserRepository userRepository;

    public List<SongEntity> getSongsByUser(UUID userId) {
        return songRepository.listSongsByUser(userId);
    }

    public SongEntity getSongById(UUID id) throws NoSuchSongException {
        Optional<SongEntity> song = songRepository.getSongById(id);
        if (song.isEmpty()) {
            throw new NoSuchSongException(String.format("Song with id %s not found", id.toString()));
        }
        return song.get();
    }

    public List<SongOutput> searchForSongs(String search) {
        List<String> ids = searchRepository.searchForSong(search);

            return !ids.isEmpty()
                    ? songRepository.searchForSongs(ids)
                    .stream()
                    .map((song) -> ToOutputMappers.toSongOutput(userRepository, song))
                    .toList()
                    : Collections.emptyList();
    }

    public SongOutput addSong(SongInput songInput) {
        if (songInput.getName().strip().length() < 1 || songInput.getArtist().strip().length() < 1) {
            throw new InvalidSongNameException("Song name and artist can't be less than 1 character");
        }

        SongEntity song = ToEntityMappers.toSongEntity(songInput);
        if (songRepository.createSong(song.id(), song.userId(), song.name(),
            song.artist(), song.releaseYear(), song.duration(), song.uploadDate(),
            song.imageUrl(), song.cloudUrl()) != 1) {
            throw new IllegalStateException("Couldn't insert the song");
        }

        Optional<PlaylistEntity> allSongsPlaylist = playlistRepository.getAllSongsPlaylist(song.userId());
        allSongsPlaylist.ifPresent(playlistEntity -> songRepository.addSongToPlaylist(playlistEntity.id(), song.id()));

        if (!searchRepository.createSongIndex(new ElasticsearchSongEntity(song.id(), song.name(), song.artist()))
                .equals(song.id().toString())) {
            throw new IllegalStateException("Couldn't create index!");
        }
        return ToOutputMappers.toSongOutput(userRepository, song);
    }

    public SongOutput deleteSong(UUID id) throws NoSuchSongException {
        Optional<SongEntity> song = songRepository.getSongById(id);
        if (song.isEmpty()) {
            throw new NoSuchSongException(String.format("Song with id %s not found", id.toString()));
        }

        if (songRepository.deleteSong(id) != 1) {
            throw new IllegalStateException("Couldn't delete the song");
        }

        if (!searchRepository.deleteSongIndex(id).equals(id.toString())) {
            throw new IllegalStateException("Couldn't delete the index!");
        }

        return ToOutputMappers.toSongOutput(userRepository, song.get());
    }


}
