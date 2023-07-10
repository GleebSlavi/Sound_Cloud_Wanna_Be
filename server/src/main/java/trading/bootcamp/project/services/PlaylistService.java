package trading.bootcamp.project.services;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.PlaylistInput;
import trading.bootcamp.project.exceptions.InvalidPlaylistNameException;
import trading.bootcamp.project.exceptions.NoSuchPlaylistException;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository repository;

    public List<PlaylistEntity> getPlaylistsByUser(UUID userId) {
        return repository.listPlaylistsByUser(userId);
    }

    public PlaylistEntity getPlaylistById(UUID id) throws NoSuchPlaylistException {
        Optional<PlaylistEntity> playlist = repository.getPlaylistById(id);
        if (playlist.isEmpty()) {
            throw new NoSuchPlaylistException(String.format("Playlist with id %s not found", id.toString()));
        }
        return playlist.get();
    }

    public PlaylistEntity addPlaylist(PlaylistInput playlistInput) {
        if (playlistInput.getName().strip().length() < 1) {
            throw new InvalidPlaylistNameException("Playlist name can't be less than 1 symbol");
        }

        PlaylistEntity playlist = Mappers.fromPlaylistInput(playlistInput);
        if (repository.createPlaylist(playlist.id(), playlist.userId(), playlist.name(),
                playlist.description(), playlist.createDate(), playlist.type()) != 1) {
            throw new IllegalStateException("Couldn't insert the playlist");
        }
        return playlist;
    }

    public PlaylistEntity deletePlaylist(UUID id) throws NoSuchPlaylistException {
        Optional<PlaylistEntity> playlist = repository.getPlaylistById(id);
        if (playlist.isEmpty()) {
            throw new NoSuchPlaylistException(String.format("Playlist with id %s not found", id.toString()));
        }

        if (repository.deletePlaylist(id) != 1) {
            throw new IllegalStateException("Couldn't delete the playlist");
        }
        return playlist.get();
    }

    public List<UUID> getSongsInPlaylistIDs(UUID playlistId) {
        return repository.getSongsInPlaylistIDs(playlistId);
    }
}