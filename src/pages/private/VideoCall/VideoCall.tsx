import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { EndCallIcon } from "../../../components/icons/EndCallIcon";
import { MicrophoneIcon } from "../../../components/icons/MicrophoneIcon";
import { MicrophoneMutedIcon } from "../../../components/icons/MicrophoneMutedIcon";
import { ShareScreenIcon } from "../../../components/icons/ShareScreenIcon";
import { StopShareScreenIcon } from "../../../components/icons/StopShareScreenIcon";
import { VideoCallIcon } from "../../../components/icons/VideoCallIcon";
import { VideoCallMuteIcon } from "../../../components/icons/VideoCallMuteIcon";
import { socketBaseUrl } from "../../../helpers/constants/configs.constant";
import { WEB_SOCKET_EVENT } from "../../../helpers/constants/websocket-event.constant";

const VideoCall: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const screenStreamRef = useRef<MediaStream | null>(null); // Ref để lưu stream màn hình

  const [isMuted, setIsMuted] = useState(true); // Trạng thái mic
  const [isScreenSharing, setIsScreenSharing] = useState(false); // Trạng thái chia sẻ màn hình
  const [isCameraOn, setIsCameraOn] = useState(true); // Trạng thái camera

  useEffect(() => {
    const servers = {
      //máy chủ STUN/TURN để giúp các trình duyệt tìm thấy nhau dù đang ở mạng khác nhau
      // STUN server: giúp tìm địa chỉ IP công cộng của máy tính
      // TURN server: giúp truyền tải dữ liệu giữa các trình duyệt khi không thể kết nối trực tiếp
      iceServers: [
        { urls: ["stun:ss-turn1.xirsys.com"] },
        {
          username:
            "08WW7cklybuAgURxv2htGziXJBbsMwpmBZlN6p-Y4VwLnm-lMYVz-feE5zo3S58WAAAAAGf-dMFsZW1pbmhob2FuZzEyMDQwNA==",
          credential: "7dd6da1a-1a0a-11f0-a88c-0242ac140004",
          urls: [
            "turn:ss-turn1.xirsys.com:80?transport=udp",
            "turn:ss-turn1.xirsys.com:3478?transport=udp",
            "turn:ss-turn1.xirsys.com:80?transport=tcp",
            "turn:ss-turn1.xirsys.com:3478?transport=tcp",
            "turns:ss-turn1.xirsys.com:443?transport=tcp",
            "turns:ss-turn1.xirsys.com:5349?transport=tcp",
          ],
        },
      ],
    };
    //   iceServers: [
    //     { urls: ["stun:hk-turn1.xirsys.com"] },
    //     {
    //       username:
    //         "t1v73xZPzrQUPUYowwXemStxpbhCDT3aafFfGTzjGMmsR929Wrjs20Ujnd5bBeiOAAAAAGdtFGt0aGFuaHB0MTExMA==",
    //       credential: "d3e1521c-c363-11ef-8aef-0242ac120004",
    //       urls: [
    //         "turn:hk-turn1.xirsys.com:80?transport=udp",
    //         "turn:hk-turn1.xirsys.com:3478?transport=udp",
    //         "turn:hk-turn1.xirsys.com:80?transport=tcp",
    //         "turn:hk-turn1.xirsys.com:3478?transport=tcp",
    //         "turns:hk-turn1.xirsys.com:443?transport=tcp",
    //         "turns:hk-turn1.xirsys.com:5349?transport=tcp",
    //       ],
    //     },
    //   ],
    // };

    // const servers = {
    //   iceServers: [
    //     { urls: "stun:stun.l.google.com:19302" },
    //     { urls: "stun:stun1.l.google.com:19302" },
    //     { urls: "stun:stun2.l.google.com:19302" },
    //     { urls: "stun:stun3.l.google.com:19302" },
    //     { urls: "stun:stun4.l.google.com:19302" },
    //   ],
    // };

    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;

    // Sự kiện để các trình duyệt gửi các địa chỉ mạng khả dụng đến nhau -ICE candidate
    // và quá trình này diễn ra liên tục cho đến khi tìm được đường truyền tốt nhất.”
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        console.log("ICE Candidate Details:", event.candidate.candidate);
        connectionRef.current?.invoke(
          WEB_SOCKET_EVENT.SEND_ICE_CANDIDATE, //sự kiện gửi
          conversationId,
          JSON.stringify(event.candidate)
        );
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peerConnection.iceConnectionState);
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Peer connection state:", peerConnection.connectionState);
    };

    // Gửi lời mời kết nối - offer chứa thông tin về khả năng kết nối của bên gửi
    peerConnection.onnegotiationneeded = async () => {
      console.log("Negotiation needed");
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      connectionRef.current?.invoke(
        WEB_SOCKET_EVENT.SEND_OFFER,
        conversationId,
        offer.sdp
      );
    };

    const connection = new HubConnectionBuilder()
      .withUrl(`${socketBaseUrl}/hubs/textChat`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    connectionRef.current = connection;

    //nhận offer từ người khác
    // lưu thông tin kết nối đó
    connection.on(WEB_SOCKET_EVENT.RECEIVE_OFFER, async (connectionId, sdp) => {
      try {
        console.log("Received Offer:", sdp);
        await peerConnection.setRemoteDescription(
          //ưu tiên lưu thông tin kết nối trước
          new RTCSessionDescription({ type: "offer", sdp })
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        connection.invoke(
          WEB_SOCKET_EVENT.SEND_ANSWER,
          conversationId,
          answer.sdp
        );
        while (iceCandidatesQueue.current.length > 0) {
          const candidate = iceCandidatesQueue.current.shift();
          if (candidate) {
            await peerConnection.addIceCandidate(candidate);
          }
        }
      } catch (error) {
        console.error("Error handling received offer:", error);
      }
    });

    //nhận answer từ người khác
    // khi người khác gửi answer thì mình sẽ nhận được và lưu thông tin kết nối
    //Tại thời điểm này, quá trình thương lượng cấu hình giữa 2 peer đã hoàn tất
    //nghĩa là cả hai bên đều biết mình có thể kết nối với nhau như thế nào.
    connection.on(
      WEB_SOCKET_EVENT.RECEIVE_ANSWER,
      async (connectionId, sdp) => {
        try {
          console.log("Received Answer:", sdp);
          if (peerConnection.signalingState === "have-local-offer") {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription({ type: "answer", sdp })
            );
            while (iceCandidatesQueue.current.length > 0) {
              const candidate = iceCandidatesQueue.current.shift();
              if (candidate) await peerConnection.addIceCandidate(candidate);
            }
          } else {
            console.warn(
              "⚠️ Cannot set answer, invalid signaling state:",
              peerConnection.signalingState
            );
          }
        } catch (error) {
          console.error("Error handling received answer:", error);
        }
      }
    );

    //nhận ICE candidate từ người khác
    // kiểm tra xem đã có thông tin kết nối chưa
    // nếu có thì thêm ICE candidate vào peer connection
    // nếu chưa có thì lưu vào queue để thêm sau
    connection.on(
      WEB_SOCKET_EVENT.RECEIVE_ICE_CANDIDATE,
      async (connectionId, candidate) => {
        try {
          const iceCandidate = new RTCIceCandidate(JSON.parse(candidate));
          console.log("Received ICE candidate:", iceCandidate);
          if (peerConnection.remoteDescription) {
            console.log("🧊 Adding ICE directly");
            await peerConnection.addIceCandidate(iceCandidate);
          } else {
            console.log("🕓 Queuing ICE until remoteDescription is set");
            iceCandidatesQueue.current.push(iceCandidate);
          }
        } catch (error) {
          console.error("Error adding received ICE candidate", error);
        }
      }
    );

    connection.start().then(() => {
      console.log("SignalR connection established");
      connection
        .invoke(WEB_SOCKET_EVENT.JOIN_CONVERSATION_GROUP, conversationId)
        .then(() => {
          console.log("Joined conversation group:", conversationId);
          const createOffer = async () => {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            connection.invoke(
              WEB_SOCKET_EVENT.SEND_OFFER,
              conversationId,
              offer.sdp
            );
            console.log("Sent Offer:", offer.sdp);
          };
          createOffer();
        });
    });

    //lấy thông tin cấu hình video, âm thanh để gửi qua kênh kết nối
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
      })
      .catch((error) => {
        if (error.name === "NotReadableError") {
          alert("Microphone is already in use by another application.");
        } else {
          console.error("Error accessing media devices:", error);
        }
      });

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      console.log("Got remote track!");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    return () => {
      peerConnection.close();
      connection.stop();
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [conversationId]);

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // Lắng nghe sự kiện khi stream bị hủy
      screenStream.getVideoTracks()[0].onended = () => {
        console.log("Screen share stopped by user from popup.");
        setIsScreenSharing(false); // Cập nhật trạng thái là không còn chia sẻ màn hình
      };

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // Thêm track của màn hình vào peer connection
      screenStream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, screenStream);
      });

      setIsScreenSharing(true);
      screenStreamRef.current = screenStream; // Lưu lại stream chia sẻ màn hình
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      // Dừng tất cả các track của stream màn hình
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      setIsScreenSharing(false);

      // Khôi phục lại camera
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Thêm lại các track của stream camera vào peer connection
          stream.getTracks().forEach((track) => {
            peerConnectionRef.current?.addTrack(track, stream);
          });

          // Kiểm tra trạng thái isCameraOn và bật/tắt camera dựa trên giá trị của nó
          if (!isCameraOn) {
            // Tắt camera nếu isCameraOn là false
            const videoTrack = stream.getVideoTracks()[0];
            videoTrack.enabled = false; // Tắt camera
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }
  };

  const toggleCamera = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !isCameraOn;
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleShareScreen = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex max-w-7xl w-full gap-4 mt-4">
        <div className="flex flex-1 flex-col justify-center items-center gap-4">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className={twMerge(
              "w-full rounded-xl bg-black",
              isCameraOn && "border-2 border-green-600"
            )}
            style={{
              aspectRatio: "16/9",
              transform: "scaleX(-1)", // Lật video ngang
            }}
          />
          <h3>Local Video</h3>
        </div>
        <div className="flex flex-1 flex-col justify-center items-center gap-4">
          <video
            style={{
              aspectRatio: "16/9",
            }}
            ref={remoteVideoRef}
            autoPlay
            className="border border-gray-300 w-full rounded-xl bg-black"
          />
          <h3>Remote Video</h3>
        </div>
      </div>
      <div className="flex gap-4 mt-4 fixed bottom-8">
        <button
          className="w-16 h-16 rounded-full flex justify-center items-center shadow-circleButton"
          onClick={toggleMute}
        >
          {isMuted ? <MicrophoneMutedIcon /> : <MicrophoneIcon />}
        </button>

        <button
          className="w-16 h-16 rounded-full flex justify-center items-center shadow-circleButton"
          onClick={toggleShareScreen}
        >
          {isScreenSharing ? <StopShareScreenIcon /> : <ShareScreenIcon />}
        </button>

        <button
          className="w-16 h-16 rounded-full flex justify-center items-center shadow-circleButton"
          onClick={toggleCamera}
        >
          {isCameraOn ? <VideoCallIcon /> : <VideoCallMuteIcon />}
        </button>
        <button
          onClick={() => {
            window.close();
          }}
          className="w-16 h-16 rounded-full flex justify-center items-center bg-red-700 shadow-circleButton"
        >
          <EndCallIcon className="text-white h-24 w-24" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
