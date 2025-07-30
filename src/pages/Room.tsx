import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MeetingProvider,
  MeetingConsumer,
} from "@videosdk.live/react-sdk";
import MeetingView from "../components/MeetingView";
import { authToken } from "../Api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Room() {
  const { roomId } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const userName = query.get("name") || "Guest";

  if (!roomId) return <div className="text-white bg-gray-900 h-screen flex items-center justify-center">Invalid Room</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <MeetingProvider
      
        config={{
          meetingId: roomId,
          micEnabled: true,
          webcamEnabled: true,
          name: userName,
          debugMode: true,
        }}
        token={authToken}
      >
        <MeetingConsumer>
          {(meeting) =>
            meeting ? (
              <MeetingView
                roomId={roomId}
                onMeetingLeave={() => navigate("/")}
              />
            ) : (
              <div className="flex items-center justify-center h-screen">
                <p className="text-lg">Loading Meeting...</p>
              </div>
            )
          }
        </MeetingConsumer>
      </MeetingProvider>
    </div>
  );
}
