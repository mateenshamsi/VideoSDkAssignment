
import { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { createMeeting, authToken } from "../Api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface MeetingRoom {
  id: string;
  name: string;
  createdAt: string;
}

export default function RoomSwitcher() {
  const meeting = useMeeting();
  const [targetMeetingId, setTargetMeetingId] = useState("");
  const [meetingHistory, setMeetingHistory] = useState<MeetingRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const navigate = useNavigate();

  const addToHistory = (meetingId: string, name: string) => {
    const newRoom: MeetingRoom = {
      id: meetingId,
      name: name || `Room ${meetingId.slice(-6)}`,
      createdAt: new Date().toLocaleTimeString(),
    };

    setMeetingHistory((prev) => {
      const updated = [newRoom, ...prev.filter((room) => room.id !== meetingId)];
      return updated.slice(0, 10);
    });
  };

  const handleSwitch = async (meetingId: string) => {
    try {
      if (!meeting || !meeting.switchTo) {
        console.error("Not yet joined in a meeting.");
        return;
      }

      console.log("Attempting to switch to:", meetingId);

      await meeting.switchTo({
        meetingId,
        token: authToken,
        name: meeting.localParticipant?.displayName || "Guest", 
      });

      console.log("Successfully switched to:", meetingId);
      toast.success(`Switched to room: ${meetingId}`);
      navigate(`/room/${meetingId}`);
    } catch (error: any) {
      console.error("Room switch failed:", error.message);
      alert(`Failed to switch to room: ${error.message}`);
    }
  };

  const handleManualSwitch = () => {
    if (!targetMeetingId.trim()) return;
    handleSwitch(targetMeetingId);
  };

  const handleCreateAndSwitch = async () => {
    try {
      if (!meeting || !meeting.switchTo) {
        console.error("Not yet joined in a meeting.");
        return;
      }

      const newMeetingId = await createMeeting({ token: authToken });
      console.log("New meeting created:", newMeetingId);

      addToHistory(newMeetingId, newRoomName);

      await new Promise((resolve) => setTimeout(resolve, 500));

      await meeting.switchTo({
        meetingId: newMeetingId,
        token: authToken,
        name: meeting.localParticipant?.displayName || "Guest", 
      });
      toast.success(`Switched to room: ${newMeetingId}`);

      console.log("Successfully switched to new meeting.");
      navigate(`/room/${newMeetingId}`);
      setNewRoomName("");
    } catch (error: any) {
      console.error("Create & switch failed:", error.message);
      alert(`Failed to create room: ${error.message}`);
    }
  };

  const handleDeleteFromHistory = (meetingId: string) => {
    setMeetingHistory((prev) => prev.filter((room) => room.id !== meetingId));
  };

  return (
    <div className="mt-4 p-4 border border-[#ccc] rounded-lg">
      <h4>🔄 Switch Room</h4>

     
      <div className="mb-4">
        <h5>Join Existing Room:</h5>
        <input
          type="text"
          placeholder="Enter Meeting ID"
          value={targetMeetingId}
          onChange={(e) => setTargetMeetingId(e.target.value)}
          className="mr-2 p-1 rounded text-black"
        />
        <button className="border rounded-lg p-2 mt-1 bg-slate-300 text-black" onClick={handleManualSwitch} disabled={!targetMeetingId.trim()}>
          Switch to Room
        </button>
      </div>

    
      <div className="mb-4">
        <h5>Create New Room:</h5>
       
        <button className="border rounded p-2 mt-1 bg-slate-300 text-black" onClick={handleCreateAndSwitch}>Create & Switch</button>
      </div>

    
      {meetingHistory.length > 0 && (
        <div>
          <h5> Recent Rooms:</h5>
          <div>
            {meetingHistory.map((room) => (
              <div
                key={room.id}
                className={`flex justify-between items-center p-2 mb-2 rounded`}
              >
                <div>
                  <strong>{room.name}</strong>
                  <br />
                  <small>ID: {room.id} | Created: {room.createdAt}</small>
                  {meeting?.meetingId === room.id && (
                    <small  className="green"> (Current)</small>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => handleSwitch(room.id)}
                    disabled={meeting?.meetingId === room.id}
                    className="mr-2"
                  >
                    {meeting?.meetingId === room.id ? "Current" : "Switch"}
                  </button>
                  <button
                    onClick={() => handleDeleteFromHistory(room.id)}
                    className="bg-red-400 text-black px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
