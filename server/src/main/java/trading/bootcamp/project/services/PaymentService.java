package trading.bootcamp.project.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.repositories.entities.UserEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserRepository userRepository;

    public PaymentIntent createPaymentIntent() throws StripeException {
        Stripe.apiKey = "sk_test_51NbNXCDapT1nmrTQymVtEAj6yn7OW9cdmLEiLXHdGTBydG3uZDFMDzL5gkihPFHdqjbLy0NT8s1apK50lyfKIppU00DBeAjALX";

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

        return PaymentIntent.create(params);
    }

    @Scheduled(fixedRate = 30000)
    public void checkSubscriptions() {
        List<UserEntity> premiumUsers = userRepository.getAllPremiumUsers();

        for (UserEntity user : premiumUsers) {
            if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(LocalDate.now())) {
                userRepository.updateUserPremium(user.getId(), false, null);
            }
        }
    }
}