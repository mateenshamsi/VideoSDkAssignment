export default function Controls({ toggleMic, toggleCamera, leave }: {
  toggleMic: () => void;
  toggleCamera: () => void;
  leave: () => void;
}) {
  return (
    <div className="mt-2.5" >
      <button onClick={() => toggleMic()}>Toggle Mic</button>
      <button onClick={() => toggleCamera()}>Toggle Webcam</button>
      <button onClick={() => leave()}>Leave</button>
    </div>
  );
}
