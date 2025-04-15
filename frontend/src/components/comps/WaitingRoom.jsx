import { AbsoluteCenter, Progress, ProgressCircle, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import socket from '../../socket';
import { useNavigate } from 'react-router-dom';

const WaitingRoom = () => {
    let username = JSON.parse(localStorage.getItem("username"));
    const navigate = useNavigate();

    socket.on("join room", (user, roomName) => {
        if (username.username == user) {
            navigate(`/room/${roomName}`);
            socket.emit("redirecting to new room", user, roomName);
        }
    });

    React.useEffect(() => {
        socket.on("reject user", (user) => {
            if (username.username == user) {
                navigate("/");
            }
        });

        socket.on("change name", (user, newUserSuffix) => {
            if (username.username == user) {
                localStorage.setItem("username", JSON.stringify({ username: `${username.username}${newUserSuffix}` }));
                username = JSON.parse(localStorage.getItem("username"));
            }
        });
    });

    return (
        <VStack h={'100vh'} align={'center'} justify={'center'}>
            <Text>Waiting for host to let you in...</Text>
        </VStack>
    )
}

export default WaitingRoom;