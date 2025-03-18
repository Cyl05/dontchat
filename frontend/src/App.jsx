import React from 'react';
import { Route, Routes } from "react-router-dom";
import ChatPage from './components/comps/ChatPage.jsx';
import HomePage from './components/comps/HomePage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:roomName" element={<ChatPage />} />
    </Routes>
  );
}

export default App;