package trading.bootcamp.project.exceptions;

public class NoSuchSongException extends Exception {

    public NoSuchSongException(String message) {
        super(message);
    }

    public NoSuchSongException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
