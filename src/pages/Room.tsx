import { useParams, useNavigate } from "react-router-dom";
import {
  MeetingProvider,
  MeetingConsumer,
} from "@videosdk.live/react-sdk";
import MeetingView from "../components/MeetingView";
import { authToken } from "../Api";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  if (!roomId) return <div>Invalid Room</div>;

  return (
    <MeetingProvider
      config={{
        meetingId: roomId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Guest",
        debugMode: false,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView
            roomId={roomId}
            onMeetingLeave={() => navigate("/")}
          />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  );
}
