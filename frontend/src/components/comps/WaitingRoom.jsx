import { Text } from '@chakra-ui/react';
import React from 'react';
import socket from '../../socket';
import { useNavigate } from 'react-router-dom';

const WaitingRoom = () => {
    const username = JSON.parse(localStorage.getItem("username"));
    const navigate = useNavigate();

    React.useEffect(() => {
        socket.on("join room", (user, roomName) => {
            if (username.username == user) {
                navigate(`/room/${roomName}`);
            }
        });
        
        socket.on("reject user", (user) => {
            if (username.username == user) {
                navigate("/");
            }
        });

        socket.on("name already exists", (user) => {
            if (username.username == user) {
                navigate("/");
            }
        });
    });

    return (
        <Text>Waiting for host to let you in...</Text>
    )
}

export default WaitingRoom;