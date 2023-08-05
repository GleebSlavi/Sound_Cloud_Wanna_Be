package trading.bootcamp.project.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.inputs.PaymentInput;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.UserEntity;
import trading.bootcamp.project.services.outputs.PaymentOutput;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    public PaymentOutput createPaymentIntent(PaymentInput paymentInput) throws StripeException {
        Stripe.apiKey = paymentInput.getStripeSecretKey();

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(1500L)
                        .setCurrency("bgn")
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods
                                        .builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

        return new PaymentOutput(PaymentIntent.create(params).getClientSecret());
    }
}