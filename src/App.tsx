// App.tsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster/> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
   </>
  );
}

export default App;
