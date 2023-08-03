package trading.bootcamp.project.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trading.bootcamp.project.api.rest.ToOutputMappers;
import trading.bootcamp.project.api.rest.inputs.StreamInput;
import trading.bootcamp.project.repositories.UserRepository;
import trading.bootcamp.project.services.outputs.StreamOutput;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class StreamService {

    private final List<StreamOutput> streams;

    private final UserRepository repository;

    public void addStream(StreamInput stream) {
        streams.add(ToOutputMappers.toStreamOutput(repository, stream));
    }

    public void removeStream(UUID id) {
        StreamOutput stream = new StreamOutput(id, "", "");
        streams.remove(stream);
    }

    private int getStreamIndex(UUID id) {
        StreamOutput stream = new StreamOutput(id, "", "");
        return streams.indexOf(stream);
    }

    public void updateStream(UUID id, StreamInput streamInput) {
        int index = getStreamIndex(id);
        streams.set(index, streams.get(index).updateStream(
                    streamInput.getSongName(),
                    streamInput.getSongArtist(),
                    streamInput.getListeners(),
                    streamInput.getSongId()));
    }

    public List<StreamOutput> getStreams() {
        return streams;
    }
}
