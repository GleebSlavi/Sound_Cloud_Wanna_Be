package trading.bootcamp.project.services;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.PlaylistInput;
import trading.bootcamp.project.exceptions.InvalidFieldException;
import trading.bootcamp.project.exceptions.NoSuchPlaylistException;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.sqls.PlaylistEntity;
import trading.bootcamp.project.services.outputs.PlaylistOutput;
import trading.bootcamp.project.services.outputs.SongOutput;
import trading.bootcamp.project.api.rest.OutputMappers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;

    private final UserRepository userRepository;

    public List<PlaylistOutput> getPlaylistsByUser(UUID userId) {
        return playlistRepository.listPlaylistsByUser(userId)
            .stream()
            .map(playlist -> OutputMappers.fromPlaylistEntity(userRepository, playlist))
            .toList();
    }

    public PlaylistOutput getPlaylistById(UUID id) throws NoSuchPlaylistException {
        Optional<PlaylistEntity> playlist = playlistRepository.getPlaylistById(id);
        if (playlist.isEmpty()) {
            throw new NoSuchPlaylistException(String.format("Playlist with id %s not found", id.toString()));
        }
        return OutputMappers.fromPlaylistEntity(userRepository, playlist.get());
    }

    public PlaylistEntity getPlaylistByNameAndUserId(UUID userId, String playlistName) {
        Optional<PlaylistEntity> playlist = playlistRepository.getPlaylistByNameAndUserId(userId, playlistName);
        return playlist.orElse(null);
    }

    public PlaylistEntity addPlaylist(PlaylistInput playlistInput) {
        if (playlistInput.getName().strip().length() < 1) {
            throw new InvalidFieldException("Playlist name can't be less than 1 symbol");
        }

        PlaylistEntity playlist = Mappers.fromPlaylistInput(playlistInput);
        if (playlistRepository.createPlaylist(playlist.id(), playlist.userId(), playlist.name(),
                playlist.description(), false, playlist.createDate(), playlist.type(), playlist.imageUrl()) != 1) {
            throw new IllegalStateException("Couldn't insert the playlist");
        }
        return playlist;
    }

    public PlaylistEntity deletePlaylist(UUID id) throws NoSuchPlaylistException {
        Optional<PlaylistEntity> playlist = playlistRepository.getPlaylistById(id);
        if (playlist.isEmpty()) {
            throw new NoSuchPlaylistException(String.format("Playlist with id %s not found", id.toString()));
        }

        if (playlistRepository.deletePlaylist(id) != 1) {
            throw new IllegalStateException("Couldn't delete the playlist");
        }
        return playlist.get();
    }

    public List<SongOutput> getSongsInPlaylist(UUID playlistId) {
        return playlistRepository.getSongsInPlaylist(playlistId)
            .stream()
            .map(song -> OutputMappers.fromSongEntity(userRepository, song))
            .toList();
    }
}
