import React from 'react';
import socket from './socket';
import { Box, Button, HStack, Input, VStack } from '@chakra-ui/react';

const App = () => {
  const [inputVal, setInputVal] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", inputVal);
    // setMessages((prev) => [...prev, inputVal]);
    setInputVal("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <HStack mx={'auto'} justify={'center'} my={5}>
        <Input w={'50%'} mr={5} onChange={(e) => setInputVal(e.target.value)} value={inputVal} />
        <Button onClick={handleSubmit}>Send</Button>
      </HStack>
      <VStack>
        {messages.map((message) => (<Box key={Math.random()}>{message}</Box>))}
      </VStack>
    </form>
  )
}

export default App;