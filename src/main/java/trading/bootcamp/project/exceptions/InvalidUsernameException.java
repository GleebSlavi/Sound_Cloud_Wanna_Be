package trading.bootcamp.project.exceptions;

public class InvalidUsernameException extends RuntimeException {

    public InvalidUsernameException(String message) {
        super(message);
    }
}
