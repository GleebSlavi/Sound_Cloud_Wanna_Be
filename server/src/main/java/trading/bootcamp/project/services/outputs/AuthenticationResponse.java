package trading.bootcamp.project.services.outputs;

import lombok.*;

import java.util.UUID;

@Data
@Builder
@RequiredArgsConstructor
public class AuthenticationResponse {

    private final String token;

    private final UUID userId;
}
