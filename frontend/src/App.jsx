import React from 'react';
import { Route, Routes } from "react-router-dom";
import ChatPage from './components/comps/ChatPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/:roomName" element={<ChatPage />} />
    </Routes>
  );
}

export default App;