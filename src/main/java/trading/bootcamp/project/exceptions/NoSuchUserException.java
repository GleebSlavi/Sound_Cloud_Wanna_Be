package trading.bootcamp.project.exceptions;

public class NoSuchUserException extends Exception {

    public NoSuchUserException(String message) {
        super(message);
    }

    public NoSuchUserException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
