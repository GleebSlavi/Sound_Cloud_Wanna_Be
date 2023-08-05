import { ReactNode, createContext, useContext, useState, useRef, useEffect } from "react";
import { StreamContextData } from "../interfaces/StreamContextData";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WebSocketMessage } from "../interfaces/WebSocketMessage";
import { Stream } from "../interfaces/Stream";
import { v4 as uuidv4 } from "uuid";
import { usePlayerContext } from "./PlayerProvider";
import { Song } from "../interfaces/Song";
import axios from "axios";
import { streamsEndpoint, websocketsEndpoint } from "../reusable_parameters/reusable_parameters";

const StreamContext = createContext<StreamContextData>({
  stompClient: null,
  isStreamOwner: false,
  streamData: {
    songId: "",
    isPlaying: false,
    songUrl: "",
    currentTime: 0,
    songName: "",
    songArtist: "",
    songImageUrl: null,
  },
  setStreamData: () => {},
  startStream: () => {},
  joinStream: () => {},
  leaveStream: () => {},
  sendData: () => {},
  inStream: false,
  streamId: "",
  streams: [],
  setStreams: () => {},
  updateStream: () => {},
});

export const useStreamContext = () => {
  return useContext(StreamContext);
};

interface Props {
  children: ReactNode;
}

const StreamProvider = ({ children }: Props) => {
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [isStreamOwner, setIsStreamOwner] = useState<boolean>(false);
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
  const [streamId, setStreamId] = useState("");
  const [streams, setStreams] = useState<Stream[]>([]);

  const {
    setCurrentPlaylist,
    setCurrentSongId,
    setSong,
    setIsPlaying,
    setPlayingPlaylistId,
    currentSongId,
    setCurrentPlaylistIndex,
  } = usePlayerContext();

  const dataRef = useRef<WebSocketMessage>();
  dataRef.current = streamData;

  const createClient = (isOwner: boolean, streamId: string) => {
    const socket: WebSocket = new SockJS("http://10.16.6.17:8080/ws");
    const client: Stomp.Client = Stomp.over(socket);

    client.connect({}, (frame) => {
      if (!isOwner) {
        client.subscribe(
          `${websocketsEndpoint}/topic/stream-end-notification/${streamId}`,
          (message) => {
            if (message.body) {
              leaveStream(client, true, true);
            }
          }
        );


        client.subscribe(`${websocketsEndpoint}/topic/stream/${streamId}`, (message) => {
          if (message.body) {
            const receivedData: WebSocketMessage = JSON.parse(message.body);
            setStreamData(receivedData);
            handleReceivedMessage(receivedData);
          }
        });

        if (!hasJoined) {
          client.send(
            `${websocketsEndpoint}/user-join/${streamId}`,
            {},
            JSON.stringify({ message: "User has joined!" })
          );
          setHasJoined(true);
        }
      } else {
        client.subscribe(
          `${websocketsEndpoint}/topic/user-join-notification/${streamId}`,
          (message) => {
            if (message.body) {
              sendData(client, dataRef.current!, streamId);
            }
          }
        );
      }
    });
    setStompClient(client);
  };

  const handleReceivedMessage = (message: WebSocketMessage) => {
    if (streamData.songId !== message.songId) {
      const song: Song = {
        id: message.songId,
        name: message.songName,
        artist: message.songArtist,
        imageUrl: message.songImageUrl,
        cloudUrl: message.songUrl,
      };

      const id = uuidv4();
      setCurrentPlaylist({ id: id, songs: [song] });
      setPlayingPlaylistId(id);
      setCurrentSongId(message.songId);

      console.log(message.currentTime!)
      setSong(
        0,
        true,
        true,
        message.currentTime !== 0
          ? message.currentTime + (Date.now() - message.delay!) / 700
          : -1
      );
      setIsPlaying(message.isPlaying);
    } else if (streamData.isPlaying !== message.isPlaying) {
      setIsPlaying(message.isPlaying);
    }
  };

  const addStreamToServer = async (
    streamId: string,
    username: string,
    imageurl: string | null
  ) => {
    try {
      const data = {
        streamId: streamId,
        songId: currentSongId ? currentSongId : uuidv4(),
        ownerId: localStorage.getItem("id"),
        songName: streamData.songName,
        songArtist: streamData.songArtist,
        listeners: 0,
      };
      await axios.post(`${streamsEndpoint}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const stream: Stream = {
        streamId: streamId,
        songId: currentSongId,
        ownerUsername: username,
        ownerImageUrl: imageurl,
        songName: data.songName,
        songArtist: data.songArtist,
        listeners: data.listeners,
      };
      setStreams((streams) => [...streams, stream]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeStreamFromServer = async (streamId: string) => {
    try {
      await axios.delete(
        `${streamsEndpoint}/${streamId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStreams(streams.filter((stream) => stream.streamId !== streamId));
    } catch (error) {
      console.log(error);
    }
  };

  const updateStream = async (
    streamId: string,
    songName: string | null,
    songArtist: string | null,
    listeners: number | null,
    ownerImage: string | null
  ) => {
    try {
      const data = {
        streamId: streamId,
        songId: currentSongId ? currentSongId : uuidv4(),
        ownerId: localStorage.getItem("id"),
        songName: songName,
        songArtist: songArtist,
        listeners: listeners,
        ownerImage: ownerImage
      };
      await axios.patch(
        `${streamsEndpoint}/${streamId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStreams(
        streams.map((stream) =>
          stream.streamId === streamId
            ? {
                ...stream,
                songName: songName ? songName : stream.songName,
                songArtist: songArtist ? songArtist : stream.songArtist,
                listeners: listeners ? listeners : stream.listeners,
                ownerImageUrl: ownerImage ? ownerImage : stream.ownerImageUrl
              }
            : stream
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const startStream = (
    streamId: string,
    username: string,
    imageUrl: string | null
  ) => {
    createClient(true, streamId);
    addStreamToServer(streamId, username, imageUrl);
    setStreamId(streamId);
    setIsStreamOwner(true);
  };

  const joinStream = (streamId: string) => {
    createClient(false, streamId);
    setInStream(true);
    setStreamId(streamId);
    updateStream(
      streamId,
      null,
      null,
      (streams.find((stream) => stream.streamId === streamId)?.listeners ?? 0) + 1,
      null);
  };

  const sendData = async (
    client: Stomp.Client,
    data: WebSocketMessage,
    streamId: string
  ) => {
    if (client && data) {
      const jsonData = JSON.stringify(data);
      console.log(data.currentTime);
      await client.send(`${websocketsEndpoint}/send-data/${streamId}`, {}, jsonData);
      console.log(data.currentTime);
    }
  };

  const leaveStream = async (client: Stomp.Client | null, ownerEnded: boolean, inStream: boolean) => {
    if (client) {
      if (isStreamOwner) {
        await client.send(
          `${websocketsEndpoint}/stream-end/${streamId}`,
          {},
          JSON.stringify({ message: "Stream has ended!" })
        );
        setIsStreamOwner(false);
        removeStreamFromServer(streamId);
        client.disconnect(() => {
          client.unsubscribe(`${websocketsEndpoint}/topic/user-join-notification/${streamId}`);
        });
      } else if (inStream) {
        console.log("here");
        setInStream(false);
        setHasJoined(false);
        setCurrentPlaylistIndex(-1);
        if (!ownerEnded) {
          updateStream(
            streamId,
            null,
            null,
            streams.find((stream) => stream.streamId === streamId)?.listeners! -
              1,
            null);
        }
        client.disconnect(() => {
          client.unsubscribe(`${websocketsEndpoint}/topic/stream/${streamId}`);
          client.unsubscribe(`${websocketsEndpoint}/topic/stream-end-notification/${streamId}`);
        });
        if (!ownerEnded) {
          updateStream(
            streamId,
            null,
            null,
            streams.find((stream) => stream.streamId === streamId)?.listeners! -
              1,
            null);
        }
      }
    }
    setStreamId("");
    setStompClient(null);
  };

  return (
    <StreamContext.Provider
      value={{
        stompClient,
        isStreamOwner,
        streamData,
        setStreamData,
        startStream,
        joinStream,
        sendData,
        inStream,
        streamId,
        leaveStream,
        streams,
        setStreams,
        updateStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export default StreamProvider;
