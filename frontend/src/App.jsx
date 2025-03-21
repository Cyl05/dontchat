import React from 'react';
import { Route, Routes } from "react-router-dom";
import ChatPage from './components/comps/ChatPage.jsx';
import HomePage from './components/comps/HomePage.jsx';
import WaitingRoom from './components/comps/WaitingRoom.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomName" element={<ChatPage />} />
      <Route path="/waiting" element={<WaitingRoom />} />
    </Routes>
  );
}

export default App;