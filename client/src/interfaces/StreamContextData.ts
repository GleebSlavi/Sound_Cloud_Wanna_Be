import Stomp from "stompjs";
import { WebSocketMessage } from "./WebSocketMessage";

export interface StreamContextData {
  stompClient: Stomp.Client | null;
  streamData: WebSocketMessage;
  setStreamData: React.Dispatch<React.SetStateAction<WebSocketMessage>>;
  startStream: () => void;
  joinStream: () => void;
  sendData: (client: Stomp.Client, data: WebSocketMessage) => void;
  inStream: boolean;
  setInStream: React.Dispatch<React.SetStateAction<boolean>>;
  isStreamOwner: boolean;
  setIsStreamOwner: React.Dispatch<React.SetStateAction<boolean>>;
}