package trading.bootcamp.project.exceptions;

public class NullUserDetailsException extends Exception {

    public NullUserDetailsException(String message) {
        super(message);
    }

    public NullUserDetailsException(String message, Throwable throwable) {
        super(message);
    }
}
