import Stomp from "stompjs";
import { WebSocketMessage } from "./WebSocketMessage";

export interface StreamContextData {
  stompClient: Stomp.Client | null;
  isStreamOwner: boolean;
  streamData: WebSocketMessage;
  setStreamData: React.Dispatch<React.SetStateAction<WebSocketMessage>>;
  startStream: () => void;
  joinStream: () => void;
  sendData: () => void;
  streaming: boolean;
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}