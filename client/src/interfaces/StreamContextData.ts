import Stomp from "stompjs";
import { WebSocketMessage } from "./WebSocketMessage";

export interface StreamContextData {
  stompClient: Stomp.Client | null;
  isStreamOwner: boolean;
  streamData: WebSocketMessage;
  setStreamData: React.Dispatch<React.SetStateAction<WebSocketMessage>>;
  startStream: () => void;
  joinStream: () => void;
  sendData: (client: Stomp.Client) => void;
  streaming: boolean;
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  inStream: boolean;
  setInStream: React.Dispatch<React.SetStateAction<boolean>>;
}