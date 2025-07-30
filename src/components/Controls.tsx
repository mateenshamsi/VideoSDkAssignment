import {Mic, MicOff, Camera, CameraOff,LogOut} from 'lucide-react'
import {useState} from 'react'

export default function Controls({ toggleMic, toggleCamera, leave }: {
  toggleMic: () => void;
  toggleCamera: () => void;
  leave: () => void;
}) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const handleMicToggle = () => {
    setIsMicOn(!isMicOn);
    toggleMic();
  };

  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
    toggleCamera();
  };

  return (
    <div className="mt-2.5 flex items-center justify-center gap-4" >
      <button onClick={handleMicToggle}>
        {isMicOn ? <Mic /> : <MicOff />}
               </button>
      <button onClick={handleCameraToggle}>
        {isCameraOn ? <Camera /> : <CameraOff />}
      </button>
      <button onClick={() => leave()}><LogOut /></button>
    </div>
  );
}