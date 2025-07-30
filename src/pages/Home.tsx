import { createMeeting,authToken} from "@/Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [meetingId, setMeetingId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    if (meetingId.trim() && userName.trim()) {
      console.log("Joining meeting:", meetingId, "as", userName);
      // Navigate to the meeting room with the meeting ID and user name
      navigate(`/room/${meetingId}?name=${encodeURIComponent(userName)}`);
    }
  };

const handleCreateMeeting = async () => {
  if (userName.trim()) {
    try {
      const newMeetingId = await createMeeting({ token: authToken });
      console.log(" Meeting Created:", newMeetingId, "for", userName);
      navigate(`/room/${newMeetingId}?name=${encodeURIComponent(userName)}`);
    } catch (error) {
      console.error(" Error creating meeting:", error);
      alert("Could not create meeting. Please try again.");
    }
  } else {
    alert("Please enter your name.");
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      
      <div >
        <div className="max-w-4xl ">
          <h1 className="text-2xl font-bold text-start">VideoMeet</h1>
        </div>
      </div>

   
      <div className="max-w-4xl mx-auto p-8">
        

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Start or Join a Meeting</h2>
          <p className="text-gray-300">Connect with people around the world</p>
        </div>

        {/* Meeting Form */}
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Join Meeting */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Join Meeting</h3>
            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter Meeting ID"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleJoinMeeting}
              disabled={!meetingId.trim() || !userName.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 p-3 rounded-lg font-medium transition-colors"
            >
              Join Meeting
            </button>
          </div>

          {/* Create Meeting */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Start New Meeting</h3>
            <button
              onClick={handleCreateMeeting}
              disabled={!userName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-3 rounded-lg font-medium transition-colors"
            >
              Create Meeting
            </button>
          </div>

        </div>

     
      </div>
    </div>
  );
}