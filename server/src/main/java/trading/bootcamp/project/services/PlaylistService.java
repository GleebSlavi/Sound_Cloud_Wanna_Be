package trading.bootcamp.project.services;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import trading.bootcamp.project.api.rest.inputs.PlaylistInput;
import trading.bootcamp.project.exceptions.InvalidFieldException;
import trading.bootcamp.project.exceptions.NoSuchPlaylistException;
import trading.bootcamp.project.repositories.ElasticsearchPlaylistRepository;
import trading.bootcamp.project.repositories.PlaylistRepository;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.ElasticsearchPlaylistEntity;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.services.outputs.PlaylistOutput;
import trading.bootcamp.project.services.outputs.SongOutput;
import trading.bootcamp.project.api.rest.ToOutputMappers;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaylistService {

    private final PlaylistRepository playlistRepository;

    private final UserRepository userRepository;

    private final ElasticsearchPlaylistRepository searchRepository;

    public List<PlaylistOutput> getPlaylistsByUser(UUID userId, Integer offset, Integer limit) {
        return playlistRepository.listPlaylistsByUser(userId, offset, limit)
            .stream()
            .map(playlist -> ToOutputMappers.toPlaylistOutput(userRepository, playlist))
            .toList();
    }

    public List<PlaylistOutput> searchForPlaylists(String search) {
        List<String> ids = searchRepository.searchForPlaylist(search);

        return !ids.isEmpty()
                ? playlistRepository.searchForPlaylists(ids)
                .stream()
                .map((playlist) -> ToOutputMappers.toPlaylistOutput(userRepository, playlist))
                .toList()
                : Collections.emptyList();
    }

    public void changePlaylistType(UUID id, PlaylistInput inputPlaylist) {
        Optional<PlaylistEntity> playlist = playlistRepository.getPlaylistById(id);
        if (playlist.isEmpty()) {
            throw new NoSuchPlaylistException("There is no playlist with such id!");
        }

        if (inputPlaylist.getType() != null) {
            playlistRepository.changePlaylistType(id, inputPlaylist.getType());
            return;
        }
        throw new IllegalStateException("There is a problem with the server");
    }

    public PlaylistOutput getPlaylistById(UUID id) throws NoSuchPlaylistException {
        Optional<PlaylistEntity> playlist = playlistRepository.getPlaylistById(id);
        if (playlist.isEmpty()) {
            throw new NoSuchPlaylistException(String.format("Playlist with id %s not found", id.toString()));
        }
        return ToOutputMappers.toPlaylistOutput(userRepository, playlist.get());
    }

    public PlaylistOutput getPlaylistByNameAndUserId(UUID userId, String playlistName) {
        Optional<PlaylistEntity> playlist = playlistRepository.getPlaylistByNameAndUserId(userId, playlistName);
        return playlist.map(playlistEntity -> ToOutputMappers.toPlaylistOutput(userRepository, playlistEntity)).orElse(null);
    }

    public PlaylistOutput addPlaylist(PlaylistInput playlistInput) {
        if (playlistInput.getName().strip().length() < 1) {
            throw new InvalidFieldException("Playlist name can't be less than 1 symbol");
        }

        PlaylistEntity playlist = ToEntityMappers.toPlaylistEntity(playlistInput);
        if (playlistRepository.createPlaylist(playlist.id(), playlist.userId(), playlist.name(),
                playlist.description(), false, playlist.createDate(), playlist.type(), playlist.imageUrl()) != 1) {
            throw new IllegalStateException("Couldn't insert the playlist");
        }

        if (!searchRepository.createPlaylistIndex(new ElasticsearchPlaylistEntity(playlist.id(), playlist.name(), playlist.type()))
                .equals(playlist.id().toString())) {
            throw new IllegalStateException("Couldn't create the index!");
        }

        return ToOutputMappers.toPlaylistOutput(userRepository, playlist);
    }

    public PlaylistOutput deletePlaylist(UUID id) throws NoSuchPlaylistException {
        Optional<PlaylistEntity> playlist = playlistRepository.getPlaylistById(id);
        if (playlist.isEmpty()) {
            throw new NoSuchPlaylistException(String.format("Playlist with id %s not found", id.toString()));
        }

        if (playlistRepository.deletePlaylist(id) != 1) {
            throw new IllegalStateException("Couldn't delete the playlist");
        }
        return ToOutputMappers.toPlaylistOutput(userRepository, playlist.get());
    }

    public void addSongToPlaylist(UUID playlistId, UUID songId) {
        if(playlistRepository.addSongToPlaylist(playlistId, songId) != 1) {
            throw new IllegalStateException("Couldn't add to the playlist");
        }
    }

    public void removeSongFromPlaylist(UUID playlistId, UUID songId) {
        if(playlistRepository.removeSongFromPlaylist(playlistId, songId) != 1) {
            throw new IllegalStateException("Couldn't remove from the playlist");
        }
    }

    public List<SongOutput> getSongsInPlaylist(UUID playlistId, Integer offset, Integer limit) {
        return playlistRepository.getSongsInPlaylist(playlistId, offset, limit)
            .stream()
            .map(song -> ToOutputMappers.toSongOutput(userRepository, song))
            .toList();
    }

    public List<PlaylistOutput> allPlaylistsNotContainingSong(UUID userId, UUID songId) {
        return playlistRepository.allPlaylistsNotContainingSong(userId, songId)
                .stream()
                .map(playlist -> ToOutputMappers.toPlaylistOutput(userRepository, playlist))
                .toList();
    }
}
