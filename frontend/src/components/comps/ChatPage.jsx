import React from 'react';
import socket from '../../socket.js';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { connectRoom } from '../../scripts.js';

const ChatPage = () => {
    const [inputVal, setInputVal] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [room, setRoom] = React.useState("");

    const { roomName } = useParams();
    socket.emit("connectRoom", roomName);

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
        socket.emit("message", inputVal, roomName);
        setInputVal("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <HStack mx={'auto'} justify={'center'} my={5}>
                <Input w={'50%'} mr={5} onChange={(e) => setInputVal(e.target.value)} value={inputVal} />
                <Button onClick={handleSubmit}>Send</Button>
            </HStack>
            <VStack>
                <Text>{room}</Text>
                {messages.map((message) => (<Box key={Math.random()}>{message}</Box>))}
            </VStack>
        </form>
    )
}

export default ChatPage