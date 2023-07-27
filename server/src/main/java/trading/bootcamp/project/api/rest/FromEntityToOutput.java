package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.repositories.entities.UserEntity;
import trading.bootcamp.project.services.outputs.PlaylistOutput;
import trading.bootcamp.project.services.outputs.SongOutput;
import trading.bootcamp.project.services.outputs.UserOutput;


@RequiredArgsConstructor
public class FromEntityToOutput {

    public static SongOutput fromSongEntity(UserRepository repository, SongEntity song) {
        String username = repository.getUserById(song.userId()).get().getUsername();
        return new SongOutput(song.id(), song.userId(), song.name(), song.artist(), song.releaseYear(),
            song.duration(), song.type(), song.uploadDate(), song.imageUrl(), song.cloudUrl(), username);
    }

    public static PlaylistOutput fromPlaylistEntity(UserRepository repository, PlaylistEntity playlist) {
        String username = repository.getUserById(playlist.userId()).get().getUsername();
        return new PlaylistOutput(playlist.id(), playlist.userId(), playlist.name(), playlist.description(), playlist.isAllSongs(),
            playlist.createDate(), playlist.type(), playlist.imageUrl(), username);
    }

    public static UserOutput fromUserEntity(UserEntity user) {
        return new UserOutput(user.getId(), user.getUsername(), user.getImageUrl(), user.getRole());
    }
}
