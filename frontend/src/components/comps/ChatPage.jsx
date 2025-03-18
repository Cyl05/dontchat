import React from 'react';
import socket from '../../socket.js';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import SenderMessage from './SenderMessage.jsx';
import ReceiverMessage from './ReceiverMessage.jsx';

const ChatPage = () => {
    const [inputVal, setInputVal] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [username, setUsername] = React.useState(JSON.parse(localStorage.getItem("username")));

    const { roomName } = useParams();
    socket.emit("connectRoom", roomName);

    React.useEffect(() => {
        socket.on("message", (msg, userName) => {
            setMessages((prev) => [...prev, [userName, msg]]);
        });

        return () => {
            socket.off("message");
        };
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", inputVal, roomName, username.username);
        setInputVal("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack>
                <HStack mx={'auto'} justify={'center'} my={5} w={'100%'}>
                    <Input w={'50%'} mr={5} onChange={(e) => setInputVal(e.target.value)} value={inputVal} />
                    <Button onClick={handleSubmit}>Send</Button>
                </HStack>
                <VStack w={'50%'}>
                    <Text>{roomName}</Text>
                    {messages.map((message) => {
                        if (message[0] == username.username) {
                            return <SenderMessage message={message[1]} sender={message[0]} />;
                        } else {
                            return <ReceiverMessage message={message[1]} sender={message[0]} />;
                        }
                    })}
                </VStack>
            </VStack>
        </form>
    )
}

export default ChatPage