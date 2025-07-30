import { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import Controls from "./Controls";
import ParticipantView from "./ParticipantView";
import RoomSwitcher from "./RoomSwitcher";

export default function MeetingView({
  roomId,
  onMeetingLeave,
}: {
  roomId: string;
  onMeetingLeave: () => void;
}) {
  const [joined, setJoined] = useState<"JOINED" | "JOINING" | null>(null);
  console.log("MeetingView rendered for roomId:", roomId);
  const { join, participants, toggleMic, toggleWebcam, leave } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onMeetingLeave,
  });

  return (
    <div>
      <h3>Meeting ID: {roomId}</h3>

      {joined === "JOINED" ? (
        <>
          <Controls
            toggleMic={toggleMic}
            toggleCamera={toggleWebcam} 
            leave={leave}
          />

          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              key={participantId}
              participantId={participantId}
            />
          ))}
            <RoomSwitcher />
        </>
      ) : joined === "JOINING" ? (
        <p>Joining meeting...</p>
      ) : (
        <button
          onClick={() => {
            setJoined("JOINING");
            join();
          }}
        >
          Join Meeting
        </button>
      )}
    </div>
  );
}
