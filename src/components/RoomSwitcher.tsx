// src/components/RoomSwitcher.tsx
import { useState, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { createMeeting, authToken } from "../Api";
import { useNavigate } from "react-router-dom";

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

  // Load meeting history from memory on component mount
  useEffect(() => {
    // You could also load from localStorage here if you want persistence
    // const saved = localStorage.getItem('meetingHistory');
    // if (saved) setMeetingHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (meetingId: string, name: string) => {
    const newRoom: MeetingRoom = {
      id: meetingId,
      name: name || `Room ${meetingId.slice(-6)}`,
      createdAt: new Date().toLocaleTimeString()
    };
    
    setMeetingHistory(prev => {
      const updated = [newRoom, ...prev.filter(room => room.id !== meetingId)];
      // Optional: Save to localStorage for persistence
      // localStorage.setItem('meetingHistory', JSON.stringify(updated));
      return updated.slice(0, 10); // Keep only last 10 rooms
    });
  };

  const handleSwitch = async (meetingId: string) => {
    try {
      if (!meeting || !meeting.switchTo) {
        console.error("Not yet joined in a meeting.");
        return;
      }

      console.log("Attempting to switch to:", meetingId);
      
      await meeting.switchTo({ meetingId, token: authToken });
      console.log("Successfully switched to:", meetingId);

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

      // Add to history before switching
      addToHistory(newMeetingId, newRoomName);

      // Small delay to ensure meeting is active
      await new Promise(resolve => setTimeout(resolve, 500));

      await meeting.switchTo({ meetingId: newMeetingId, token: authToken });
      console.log("Successfully switched to new meeting.");

      navigate(`/room/${newMeetingId}`);
      setNewRoomName(""); // Clear the input
    } catch (error: any) {
      console.error("Create & switch failed:", error.message);
      alert(`Failed to create room: ${error.message}`);
    }
  };

  const handleDeleteFromHistory = (meetingId: string) => {
    setMeetingHistory(prev => prev.filter(room => room.id !== meetingId));
  };

  return (
    <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h4>🔄 Switch Room</h4>
      
      {/* Manual Room Switch */}
      <div style={{ marginBottom: "1rem" }}>
        <h5>Join Existing Room:</h5>
        <input
          type="text"
          placeholder="Enter Meeting ID"
          value={targetMeetingId}
          onChange={(e) => setTargetMeetingId(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.3rem" }}
        />
        <button onClick={handleManualSwitch} disabled={!targetMeetingId.trim()}>
          Switch to Room
        </button>
      </div>

      {/* Create New Room */}
      <div style={{ marginBottom: "1rem" }}>
        <h5>Create New Room:</h5>
        <input
          type="text"
          placeholder="Room name (optional)"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.3rem" }}
        />
        <button onClick={handleCreateAndSwitch}>
          Create & Switch
        </button>
      </div>

      {/* Meeting History */}
      {meetingHistory.length > 0 && (
        <div>
          <h5>📋 Recent Rooms:</h5>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {meetingHistory.map((room) => (
              <div 
                key={room.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "0.5rem", 
                  margin: "0.2rem 0", 
                  border: "1px solid #eee", 
                  borderRadius: "4px",
                  backgroundColor: meeting?.meetingId === room.id ? "#e8f5e8" : "#f9f9f9"
                }}
              >
                <div>
                  <strong>{room.name}</strong>
                  <br />
                  <small>ID: {room.id} | Created: {room.createdAt}</small>
                  {meeting?.meetingId === room.id && (
                    <small style={{ color: "green" }}> (Current)</small>
                  )}
                </div>
                <div>
                  <button 
                    onClick={() => handleSwitch(room.id)}
                    disabled={meeting?.meetingId === room.id}
                    style={{ marginRight: "0.5rem" }}
                  >
                    {meeting?.meetingId === room.id ? "Current" : "Switch"}
                  </button>
                  <button 
                    onClick={() => handleDeleteFromHistory(room.id)}
                    style={{ backgroundColor: "#ff6b6b", color: "white", border: "none", padding: "0.2rem 0.5rem", borderRadius: "3px" }}
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