import { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import Controls from "./Controls";
import ParticipantView from "./ParticipantView";

export default function MeetingView({
  meetingId,
  onMeetingLeave,
}: {
  meetingId: string;
  onMeetingLeave: () => void;
}) {
  const [joined, setJoined] = useState<"JOINED" | "JOINING" | null>(null);

  const { join, participants, toggleMic, toggleWebcam, leave } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onMeetingLeave,
  });

  return (
    <div>
      <h3>Meeting ID: {meetingId}</h3>

      {joined === "JOINED" ? (
        <>
          <Controls
            toggleMic={toggleMic}
            toggleCamera={toggleWebcam} // renamed for clarity
            leave={leave}
          />

          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              key={participantId}
              participantId={participantId}
            />
          ))}
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
