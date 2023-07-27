package trading.bootcamp.project.services;

import trading.bootcamp.project.api.rest.inputs.PlaylistInput;
import trading.bootcamp.project.api.rest.inputs.SongInput;
import trading.bootcamp.project.api.rest.inputs.UserInput;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.SongEntity;
import trading.bootcamp.project.repositories.entities.UserEntity;

import java.time.LocalDate;
import java.util.UUID;

public class FromInputToEntityMappers {

    public static UserEntity fromUserInput(UserInput user) {
        return new UserEntity(UUID.randomUUID(), user.getUsername(), user.getEmail(), user.getNewPassword(), LocalDate.now(), null);
   }

    public static PlaylistEntity fromPlaylistInput(PlaylistInput playlist) {
        return new PlaylistEntity(UUID.randomUUID(), playlist.getUserId(), playlist.getName(),
            playlist.getDescription(), false, LocalDate.now(), playlist.getType(), playlist.getImageUrl());
    }

    public static SongEntity fromSongInput(SongInput song) {
        return new SongEntity(UUID.randomUUID(), song.getUserid(), song.getName(), song.getArtist(),
            song.getReleaseYear(), song.getDuration(), song.getType(), LocalDate.now(), song.getImageUrl(), song.getCloudUrl());
    }
}
