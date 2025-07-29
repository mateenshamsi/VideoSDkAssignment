import { useState } from "react"
export default function JoinScreen({
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