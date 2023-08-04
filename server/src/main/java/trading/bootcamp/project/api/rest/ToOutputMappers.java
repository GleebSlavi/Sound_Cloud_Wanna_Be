package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import trading.bootcamp.project.api.rest.inputs.StreamInput;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.repositories.entities.UserEntity;
import trading.bootcamp.project.services.outputs.PlaylistOutput;
import trading.bootcamp.project.services.outputs.SongOutput;
import trading.bootcamp.project.services.outputs.StreamOutput;
import trading.bootcamp.project.services.outputs.UserOutput;


@RequiredArgsConstructor
public class ToOutputMappers {

    public static SongOutput toSongOutput(UserRepository repository, SongEntity song) {
        String username = repository.getUserById(song.userId()).get().getUsername();
        return new SongOutput(song.id(), song.userId(), song.name(), song.artist(), song.releaseYear(),
            song.duration(), song.uploadDate(), song.imageUrl(), song.cloudUrl(), username);
    }

    public static PlaylistOutput toPlaylistOutput(UserRepository repository, PlaylistEntity playlist) {
        String username = repository.getUserById(playlist.userId()).get().getUsername();
        return new PlaylistOutput(playlist.id(), playlist.userId(), playlist.name(), playlist.description(), playlist.isAllSongs(),
            playlist.createDate(), playlist.type(), playlist.imageUrl(), username);
    }

    public static UserOutput toUserOutput(UserEntity user) {
        return new UserOutput(user.getId(), user.getUsername(), user.getImageUrl(), user.getIsPremium(), user.getLeftSongs(), user.getRole());
    }

    public static StreamOutput toStreamOutput(UserRepository repository, StreamInput stream) {
        UserEntity user = repository.getUserById(stream.getOwnerId()).get();
        return new StreamOutput(stream.getStreamId(), stream.getSongId(), user.getUsername(), user.getImageUrl(), stream.getSongName(), stream.getSongArtist(), stream.getListeners());
    }
}
