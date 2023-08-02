package trading.bootcamp.project.api.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import trading.bootcamp.project.api.rest.inputs.StreamInput;
import trading.bootcamp.project.services.StreamService;
import trading.bootcamp.project.services.outputs.StreamOutput;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/streams")
@RequiredArgsConstructor
public class StreamController {

    private final StreamService service;

    @GetMapping
    public List<StreamOutput> getStreams() {
        return service.getStreams();
    }

    @PostMapping
    public void newStream(@RequestBody StreamInput stream) {
        service.addStream(stream);
    }

    @DeleteMapping("/{id}")
    public void removeStream(@PathVariable("id") UUID id) {
        service.removeStream(id);
    }

    @PatchMapping("/{id}")
    public void updateStream(@PathVariable("id") UUID id,
                             @RequestBody StreamInput stream) {
        service.updateStream(id, stream);
    }
}
