import { ReactNode, createContext, useContext, useState } from "react"
import { StreamContextData } from "../interfaces/StreamContextData";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WebSocketMessage } from "../interfaces/WebSocketMessage";
import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { usePlayerContext } from "./PlayerProvider";
import { Song } from "../interfaces/Song";


const StreamContext = createContext<StreamContextData>({
  stompClient: null,
  isStreamOwner: false,
  streamData: {isPlaying: false,
    songUrl: "",
    currentTime: 0,
    songName: "",
    songArtist: "",
    songImageUrl: null,},
  setStreamData: () => {},
  startStream: () => {},
  joinStream: () => {},
  sendData: () => {},
  streaming: false,
  setStreaming: () => {}
})

export const useStreamContext = () => {
  return useContext(StreamContext);
}

interface Props {
  children: ReactNode;
}

const StreamProvider = ({ children }: Props) => {
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [isStreamOwner, setIsStreamOwner] = useState<boolean>(false)
  const [streamData, setStreamData] = useState<WebSocketMessage>({
    isPlaying: false,
    songUrl: "",
    currentTime: 0,
    songName: "",
    songArtist: "",
    songImageUrl: null,
  });
  const [streaming, setStreaming] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const { setCurrentPlaylist, setOriginalPlaylist, setCurrentSongId,
  setSong } = usePlayerContext();


  const createClient = (isOwner: boolean) => {
    const socket: WebSocket = new SockJS("http://localhost:8080/ws");
    const client: Stomp.Client = Stomp.over(socket);

    client.connect(
      {},
      (frame) => {
        if (!isOwner) {
          client.subscribe("/topic/stream", (message) => {
            if (message.body) {
              const receivedData: WebSocketMessage = JSON.parse(message.body);
              setStreamData(receivedData);
              handleReceivedMessage(receivedData);
            }
          });

          if (!hasJoined) {
            client.send("/app/user-join", {});
            setHasJoined(true);
          }
        } else {
          client.subscribe("/topic/user-join-notification", (message) => {
            if (message.body) {
              sendData();
            }
          })
        }
      }
    );

    setStompClient(client);
  }

  const handleReceivedMessage = (message: WebSocketMessage) => {
    
  }

  const startStream = () => {
    createClient(true);
    setIsStreamOwner(true);
    setStreaming(true);
  }

  const joinStream = () => {
    createClient(false);
  }

  const sendData = () => {
    if (stompClient && streamData) {
      const jsonData = JSON.stringify(streamData);
      stompClient.send(
        "/app/send-stream-data",
        {},
        jsonData);
    }
  }

  return <StreamContext.Provider value={{
    stompClient, isStreamOwner, streamData,
    setStreamData, startStream, joinStream, sendData,
    streaming, setStreaming
  }}>
    {children}
  </StreamContext.Provider>
}

export default StreamProvider;