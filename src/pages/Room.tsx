import { useState, useRef } from 'react';

type RoomId = 'A' | 'B';

type Meeting = {
  id: string;
  join: () => Promise<void>;
  leave: () => Promise<void>;
  enableWebcam: () => Promise<void>;
  disableWebcam: () => Promise<void>;
  unmuteMic: () => Promise<void>;
  muteMic: () => Promise<void>;
  on: (event: string, handler: () => void) => void;
};

type RoomState = {
  connected: boolean;
  participants: number;
  meeting: Meeting | null;
};

type RoomStates = Record<RoomId, RoomState>;

type LogType = 'info' | 'success' | 'error';

type LogEntry = {
  type: LogType;
  message: string;
  timestamp: Date;
};

type Participant = {
  displayName: string;
};

const VideoSDKRoomSwitcher = () => {
  const [config, setConfig] = useState({ authToken:import.meta.env.token, roomIdA: '', roomIdB: '' });
  const [roomStates, setRoomStates] = useState<RoomStates>({
    A: { connected: false, participants: 0, meeting: null },
    B: { connected: false, participants: 0, meeting: null }
  });
  const [currentRoom, setCurrentRoom] = useState<RoomId | null>(null);
  const [mediaControls, setMediaControls] = useState({ micEnabled: true, cameraEnabled: true });
  const [logs, setLogs] = useState<LogEntry[]>([{
    type: 'info',
    message: 'Ready to initialize rooms...',
    timestamp: new Date()
  }]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  const addLog = (type: LogType, message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const initializeRooms = async () => {
    if (!config.authToken || !config.roomIdA || !config.roomIdB) {
      addLog('error', 'Please fill in all configuration fields');
      return;
    }

    try {
      addLog('info', 'Initializing VideoSDK...');

      const mockMeeting = (id: string): Meeting => ({
        id,
        join: () => Promise.resolve(),
        leave: () => Promise.resolve(),
        enableWebcam: () => Promise.resolve(),
        disableWebcam: () => Promise.resolve(),
        unmuteMic: () => Promise.resolve(),
        muteMic: () => Promise.resolve(),
        on: (event, handler) => {
          setTimeout(() => {
            if (event === 'meeting-joined') handler();
          }, 1000);
        }
      });

      setRoomStates({
        A: { ...roomStates.A, meeting: mockMeeting(config.roomIdA) },
        B: { ...roomStates.B, meeting: mockMeeting(config.roomIdB) }
      });

      setIsInitialized(true);
      addLog('success', 'Rooms initialized successfully');
    } catch (err: any) {
      addLog('error', `Initialization failed: ${err.message}`);
    }
  };

  const joinRoom = async (roomId: RoomId) => {
    const meeting = roomStates[roomId].meeting;
    if (!meeting) {
      addLog('error', `Room ${roomId} not initialized`);
      return;
    }

    try {
      if (currentRoom && currentRoom !== roomId) {
        await leaveRoom(currentRoom, true);
      }

      await meeting.join();
      if (mediaControls.cameraEnabled) await meeting.enableWebcam();
      if (mediaControls.micEnabled) await meeting.unmuteMic();

      setCurrentRoom(roomId);
      setRoomStates(prev => ({
        ...prev,
        [roomId]: { ...prev[roomId], connected: true, participants: 1 }
      }));

      addLog('success', `Joined Room ${roomId}`);
    } catch (err: any) {
      addLog('error', `Failed to join Room ${roomId}: ${err.message}`);
    }
  };

  const leaveRoom = async (roomId: RoomId, silent = false) => {
    const meeting = roomStates[roomId].meeting;
    if (!meeting || !roomStates[roomId].connected) {
      if (!silent) addLog('error', `Not connected to Room ${roomId}`);
      return;
    }

    try {
      await meeting.leave();
      setRoomStates(prev => ({
        ...prev,
        [roomId]: { ...prev[roomId], connected: false, participants: 0 }
      }));

      if (currentRoom === roomId) setCurrentRoom(null);
      if (!silent) addLog('success', `Left Room ${roomId}`);
    } catch (err: any) {
      addLog('error', `Failed to leave Room ${roomId}: ${err.message}`);
    }
  };

  const switchRooms = async () => {
    if (!currentRoom) {
      addLog('error', 'No current room to switch from');
      return;
    }

    const targetRoom: RoomId = currentRoom === 'A' ? 'B' : 'A';
    setIsSwitching(true);

    try {
      await joinRoom(targetRoom);
      await leaveRoom(currentRoom, true);
      addLog('success', `Switched to Room ${targetRoom}`);
    } catch (err: any) {
      addLog('error', `Room switch failed: ${err.message}`);
    } finally {
      setIsSwitching(false);
    }
  };

  const toggleMic = async () => {
    if (!currentRoom) return;
    const meeting = roomStates[currentRoom].meeting;
    if (!meeting) return;

    try {
      if (mediaControls.micEnabled) {
        await meeting.muteMic();
        addLog('info', 'Mic muted');
      } else {
        await meeting.unmuteMic();
        addLog('info', 'Mic unmuted');
      }
      setMediaControls(prev => ({ ...prev, micEnabled: !prev.micEnabled }));
    } catch (err: any) {
      addLog('error', `Mic toggle failed: ${err.message}`);
    }
  };

  const toggleCamera = async () => {
    if (!currentRoom) return;
    const meeting = roomStates[currentRoom].meeting;
    if (!meeting) return;

    try {
      if (mediaControls.cameraEnabled) {
        await meeting.disableWebcam();
        addLog('info', 'Camera off');
      } else {
        await meeting.enableWebcam();
        addLog('info', 'Camera on');
      }
      setMediaControls(prev => ({ ...prev, cameraEnabled: !prev.cameraEnabled }));
    } catch (err: any) {
      addLog('error', `Camera toggle failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <button onClick={initializeRooms} className="bg-blue-600 text-white px-4 py-2 rounded">
        Initialize Rooms
      </button>

      <div className="grid md:grid-cols-2 gap-4">
        {(['A', 'B'] as RoomId[]).map(roomId => (
          <div key={roomId} className="p-4 border rounded-lg shadow">
            <h2 className="font-bold text-xl mb-2">Room {roomId}</h2>
            <p>Status: {roomStates[roomId].connected ? 'Connected' : 'Disconnected'}</p>
            <p>Participants: {roomStates[roomId].participants}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => joinRoom(roomId)} disabled={roomStates[roomId].connected}>
                Join
              </button>
              <button onClick={() => leaveRoom(roomId)} disabled={!roomStates[roomId].connected}>
                Leave
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={switchRooms} disabled={!currentRoom || isSwitching}>
          {isSwitching ? 'Switching...' : `Switch to Room ${currentRoom === 'A' ? 'B' : 'A'}`}
        </button>
        <button onClick={toggleMic}>{mediaControls.micEnabled ? 'Mute Mic' : 'Unmute Mic'}</button>
        <button onClick={toggleCamera}>{mediaControls.cameraEnabled ? 'Turn Off Cam' : 'Turn On Cam'}</button>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Logs</h3>
        <div className="bg-gray-100 p-2 max-h-64 overflow-y-auto space-y-1">
          {logs.slice(-10).map((log, idx) => (
            <div key={idx} className={`text-sm ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-600' : 'text-blue-500'}`}>
              [{log.timestamp.toLocaleTimeString()}] {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSDKRoomSwitcher;
