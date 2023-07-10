package trading.bootcamp.project.exceptions;

public class NoSuchPlaylistException extends Exception {

    public NoSuchPlaylistException(String message) {
        super(message);
    }

    public NoSuchPlaylistException(String message, Throwable throwable) {
        super(message, throwable);
    }
}