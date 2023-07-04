package trading.bootcamp.project.api.rest.inputs;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserInput {

    private final String username;

    private final String email;

    private final String password;

    @JsonCreator
    public UserInput(@JsonProperty("username") String username,
                     @JsonProperty("email") String email,
                     @JsonProperty("password") String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

}
