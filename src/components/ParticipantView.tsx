import { useParticipant } from "@videosdk.live/react-sdk";
import { useRef,useEffect,useMemo } from "react";


export default function ParticipantView({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
  } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamOn, webcamStream]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoStream]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch((err) => {
          console.error("Mic play error", err);
        });
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micOn, micStream]);

  return (
    <div style={{ margin: "16px", border: "1px solid #ddd", padding: "10px" }}>
      <p>
        {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        style={{ width: "300px", height: "200px", backgroundColor: "#000" }}
      />
      <audio ref={micRef} autoPlay muted={isLocal} />
    </div>
  );
}