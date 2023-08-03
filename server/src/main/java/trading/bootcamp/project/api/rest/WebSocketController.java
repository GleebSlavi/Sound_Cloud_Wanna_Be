package trading.bootcamp.project.api.rest;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import trading.bootcamp.project.api.rest.inputs.WebSocketMessage;

@Controller
public class WebSocketController {

    @MessageMapping("/stream-end/{streamId}")
    @SendTo("/topic/stream-end-notification/{streamId}")
    public String streamEnded(@Payload String message) {
        return message;
    }


    @MessageMapping("/send-data/{streamId}")
    @SendTo("/topic/stream/{streamId}")
    public WebSocketMessage broadcastMessage(@Payload WebSocketMessage message) {
       return message;
    }

    @MessageMapping("/user-join/{streamId}")
    @SendTo("/topic/user-join-notification/{streamId}")
    public String handleUserJoin(@Payload String message) {
        return message;
    }   
}
