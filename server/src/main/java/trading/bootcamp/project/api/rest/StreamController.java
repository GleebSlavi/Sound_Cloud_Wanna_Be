package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
public class StreamController {

    @MessageMapping("/ws/streams")
    @SendTo("/stream/{streamId}")
    public byte[] streamAudio(@Payload byte[] audioData) {
        // Here, you can choose to perform some checks or validations on the audio URL, if needed.
        // For example, you can check if the URL is valid or authorized before proceeding.

        // Now, you don't need to fetch the audio stream from S3 within the WebSocket handler.
        // Instead, you simply send the audio URL to the frontend.

        // You can use `headerAccessor.getSessionId()` to identify the client if required.
        // You might want to store the audio URL and client ID in some data structure
        // so you can later manage streaming and closing connections for specific streams.

        // The frontend will receive this audio URL through WebSocket and handle audio streaming there.
        // Since we are not handling the actual audio streaming in the backend, there is no additional code required here.
        return audioData;
    }
}
