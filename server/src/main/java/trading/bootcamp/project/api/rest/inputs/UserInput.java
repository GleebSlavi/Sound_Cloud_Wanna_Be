package trading.bootcamp.project.api.rest.inputs;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserInput {

    private final String email;

    private final String username;

    private final String oldPassword;

    private final String newPassword;

    private final String imageUrl;

    @JsonCreator
    public UserInput(@JsonProperty("email") String email,
                     @JsonProperty("username") String username,
                     @JsonProperty("oldPassword") String oldPassword,
                     @JsonProperty("newPassword") String newPassword,
                     @JsonProperty("imageUrl") String imageUrl) {
        this.email = email;
        this.username = username;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.imageUrl = imageUrl;
    }
}
