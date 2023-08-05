package trading.bootcamp.project.api.rest;

import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.PaymentInput;
import trading.bootcamp.project.services.PaymentService;
import trading.bootcamp.project.services.outputs.PaymentOutput;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/payments")
public class PaymentController {

    private final PaymentService service;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PaymentOutput> subscription(@RequestBody PaymentInput paymentInput) {
        try {
            return ResponseEntity.ok(service.createPaymentIntent(paymentInput));
        } catch (StripeException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
