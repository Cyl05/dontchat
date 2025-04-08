import { Button, Heading, HStack, Icon, Input, VStack } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import { IoChatbox } from 'react-icons/io5';

const HomePage = () => {
    const [usernameInput, setUsernameInput] = React.useState("");
    const [roomName, setRoomName] = React.useState("");

    const navigate = useNavigate();

    const handleSubmit = () => {
        localStorage.setItem("username", JSON.stringify({username: usernameInput}));
        socket.emit("join request", usernameInput, roomName);
        navigate("/waiting");
    }
    
    return (
        <VStack h={'100vh'} w={'100%'} align={'center'} justify={'center'} gap={5}>
            <HStack align={'flex-start'}>
                <Heading size="6xl">DONTCHAT</Heading>
                <Icon size="2xl">
                    <IoChatbox />
                </Icon>
            </HStack>
            <Input w={'40%'} placeholder='Username' value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
            <Input w={'40%'} placeholder='Room Name' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <Button onClick={handleSubmit}>Go</Button>  
        </VStack>
    )
}

export default HomePage;