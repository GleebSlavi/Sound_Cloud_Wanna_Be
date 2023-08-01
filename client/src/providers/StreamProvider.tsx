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
  setIsStreamOwner: () => {},
  streamData: {
    songId: "",
    isPlaying: false,
    songUrl: "",
    currentTime: 0,
    songName: "",
    songArtist: "",
    songImageUrl: null,},
  setStreamData: () => {},
  startStream: () => {},
  joinStream: () => {},
  sendData: () => {},
  inStream: false,
  setInStream: () => {}
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
    songId: "",
    isPlaying: false,
    songUrl: "",
    currentTime: 0,
    songName: "",
    songArtist: "",
    songImageUrl: null,
  });
  const [hasJoined, setHasJoined] = useState(false);
  const [inStream, setInStream] = useState(false);

  const { setCurrentPlaylist, setCurrentSongId,
  setSong, setIsPlaying, setPlayingPlaylistId, currentTime } = usePlayerContext();


  const createClient = (isOwner: boolean) => {
    const socket: WebSocket = new SockJS("http://10.16.6.17:8080/ws");
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
              const updatedData: WebSocketMessage = {
                ...streamData,
                currentTime: currentTime,
                delay: Date.now()
              };
              sendData(client, updatedData);
            }
          })
        }
      }
    );
    setStompClient(client);
  }

  const handleReceivedMessage = (message: WebSocketMessage) => {
    if (streamData.songId !== message.songId) {
      const song: Song = {
        id: message.songId,
        name: message.songName,
        artist: message.songArtist,
        imageUrl: message.songImageUrl,
        cloudUrl: message.songUrl
      }

      const id = uuidv4();
      setCurrentPlaylist({id: id, songs: [song]});
      setPlayingPlaylistId(id);
      setCurrentSongId(message.songId);
      setSong(0, true, true, message.currentTime + ((Date.now() - message.delay!) / 1000));
      setIsPlaying(message.isPlaying);
    } else if (streamData.isPlaying !== message.isPlaying) {
      setIsPlaying(message.isPlaying);
    }
  }

  const startStream = () => {
    createClient(true);
    setIsStreamOwner(true);
    setIsStreamOwner(true);
  }

  const joinStream = () => {
    createClient(false);
    setInStream(true);
  }

  const sendData = (client: Stomp.Client, data: WebSocketMessage) => {
    if (client && data) {
      setStreamData(data);
      const jsonData = JSON.stringify(data);
      client.send(
        "/app/send-data",
        {},
        jsonData);
    }
  }

  return <StreamContext.Provider value={{
    stompClient, isStreamOwner, setIsStreamOwner, streamData,
    setStreamData, startStream, joinStream, sendData,
    inStream, setInStream
  }}>
    {children}
  </StreamContext.Provider>
}

export default StreamProvider;