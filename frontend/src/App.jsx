import React from 'react';
import socket from './socket';

const App = () => {
  const [inputVal, setInputVal] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", inputVal);
    setInputVal("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={(e) => setInputVal(e.target.value)} value={inputVal}></input>
      
    </form>
  )
}

export default App;