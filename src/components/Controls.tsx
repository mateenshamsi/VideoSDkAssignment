export default function Controls({ toggleMic, toggleCamera, leave }: {
  toggleMic: () => void;
  toggleCamera: () => void;
  leave: () => void;
}) {
  return (
    <div style={{ margin: "10px 0" }}>
      <button onClick={() => toggleMic()}>Toggle Mic</button>
      <button onClick={() => toggleCamera()}>Toggle Webcam</button>
      <button onClick={() => leave()}>Leave</button>
    </div>
  );
}
