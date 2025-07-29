import "./App.css";
import {useState} from "react";
import {
  MeetingProvider,
  MeetingConsumer,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./Api";
import JoinScreen from "./components/JoinScreen";
import MeetingView from "./components/MeetingView";




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
