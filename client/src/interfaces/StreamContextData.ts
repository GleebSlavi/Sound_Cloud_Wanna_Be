import Stomp from "stompjs";
import { WebSocketMessage } from "./WebSocketMessage";
import { Stream } from "./Stream";

export interface StreamContextData {
  stompClient: Stomp.Client | null;
  streamData: WebSocketMessage;
  setStreamData: React.Dispatch<React.SetStateAction<WebSocketMessage>>;
  startStream: (
    streamId: string,
    username: string,
    imageUrl: string | null
  ) => void;
  joinStream: (streamId: string) => void;
  leaveStream: () => void;
  sendData: (
    client: Stomp.Client,
    data: WebSocketMessage,
    streamId: string
  ) => void;
  inStream: boolean;
  isStreamOwner: boolean;
  streamId: string;
  streams: Stream[];
  setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
  updateStream: (
    streamId: string,
    songName: string | null,
    songArtist: string | null,
    listeners: number | null
  ) => void;
}
