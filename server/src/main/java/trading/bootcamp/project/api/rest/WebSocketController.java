package trading.bootcamp.project.api.rest;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import trading.bootcamp.project.api.rest.inputs.WebSocketMessage;

@Controller
public class WebSocketController {

    @MessageMapping("/send-data")
    @SendTo("/topic/stream")
    public WebSocketMessage broadcastMessage(@Payload WebSocketMessage message) {
       return message;
    }

    @MessageMapping("/user-join")
    @SendTo("/topic/user-join-notification")
    public String handleUserJoin() {
        return "User has joined!";
    }
}
