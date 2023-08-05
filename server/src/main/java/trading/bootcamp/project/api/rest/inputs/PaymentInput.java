package trading.bootcamp.project.api.rest.inputs;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PaymentInput {

    private final String stripeSecretKey;

    @JsonCreator
    public PaymentInput(@JsonProperty("stripeSecretKey") String stripeSecretKey) {
        this.stripeSecretKey = stripeSecretKey;
    }
}
