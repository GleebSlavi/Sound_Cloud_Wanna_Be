package trading.bootcamp.project.exceptions;

public class InvalidEmailException extends Exception {

    public InvalidEmailException(String message) {
        super(message);
    }

    public InvalidEmailException(String message, Throwable throwable) {
        super(message, throwable);
    }

}
