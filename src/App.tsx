import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./Api";

// ------------------------
// JoinScreen Component
// ------------------------

function JoinScreen({
  getMeetingAndToken,
}: {
  getMeetingAndToken: (id: string | null) => Promise<void>;
}) {
  const [meetingId, setMeetingId] = useState<string | null>(null);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting ID"
        onChange={(e) => setMeetingId(e.target.value)}
      />
      <button onClick={() => getMeetingAndToken(meetingId)}>Join</button>
      {" or "}
      <button onClick={() => getMeetingAndToken(null)}>Create Meeting</button>
    </div>
  );
}

// ------------------------
// ParticipantView Component
// ------------------------

function ParticipantView({ participantId }: { participantId: string }) {
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

// ------------------------
// Controls Component
// ------------------------

function Controls() {
  const { toggleMic, toggleWebcam, leave } = useMeeting();

  return (
    <div style={{ margin: "10px 0" }}>
      <button onClick={toggleMic}>Toggle Mic</button>
      <button onClick={toggleWebcam}>Toggle Webcam</button>
      <button onClick={leave}>Leave</button>
    </div>
  );
}

// ------------------------
// MeetingView Component
// ------------------------

function MeetingView({
  meetingId,
  onMeetingLeave,
}: {
  meetingId: string;
  onMeetingLeave: () => void;
}) {
  const [joined, setJoined] = useState<"JOINED" | "JOINING" | null>(null);

  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onMeetingLeave,
  });

  return (
    <div>
      <h3>Meeting ID: {meetingId}</h3>

      {joined === "JOINED" ? (
        <>
          <Controls />
          {[...participants.keys()].map((participantId) => (
            <ParticipantView key={participantId} participantId={participantId} />
          ))}
        </>
      ) : joined === "JOINING" ? (
        <p>Joining meeting...</p>
      ) : (
        <button onClick={() => {
          setJoined("JOINING");
          join();
        }}>Join Meeting</button>
      )}
    </div>
  );
}

// ------------------------
// App Component
// ------------------------

function App() {
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const getMeetingAndToken = async (id: string | null) => {
    const newMeetingId = id === null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(newMeetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Your Name",
        debugMode: true,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;
