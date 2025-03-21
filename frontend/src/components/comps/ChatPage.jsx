import React from 'react';
import socket from '../../socket.js';
import { Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import SenderMessage from './SenderMessage.jsx';
import ReceiverMessage from './ReceiverMessage.jsx';
import SettingsDialog from './Settings/SettingsDialog.jsx';
import PendingInvites from './PendingInvites.jsx';

const ChatPage = () => {
    const [inputVal, setInputVal] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [username, setUsername] = React.useState(JSON.parse(localStorage.getItem("username")));
    const [isOwner, setIsOwner] = React.useState(false);
    const [invites, setInvites] = React.useState([]);

    const [userLimit, setUserLimit] = React.useState(2);
    const [checked, setChecked] = React.useState(true);

    const { roomName } = useParams();
    const navigate = useNavigate();
    socket.emit("connectRoom", roomName, checked, username.username);

    const acceptInvite = (user) => {
        setInvites(invites.filter(invite => invite != user));
        socket.emit("accepted user", user, roomName);
    };

    const rejectInvite = (user) => {
        setInvites(invites.filter(invite => invite != user));
        socket.emit("rejected user", user);
    }

    React.useEffect(() => {
        socket.on("message", (msg, userName) => {
            setMessages((prev) => [...prev, [userName, msg]]);
        });

        socket.on("room owner", (owner) => {
            if (owner == username.username) {
                setIsOwner(true);
            }
        });

        socket.on("requesting", (user) => {
            if (!invites.includes(user)) {
                setInvites((prev) => [...prev, user]);
            } else {
                socket.emit("duplicate name", user);
            }
        });

        socket.on("kick out", (user) => {
            if (username.username == user) {
                navigate("/");
            }
        })

        const handleBeforeUnload = () => {
            socket.emit("client-leaving", username.username, roomName);
            setTimeout(() => socket.disconnect(), 100); // Small delay to ensure event is sent
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

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
                <HStack w={'50%'}>
                    <VStack w={'95%'}>
                        <Text>{roomName}</Text>
                        {messages.map((message) => {
                            if (message[0] == username.username) {
                                return <SenderMessage message={message[1]} sender={message[0]} />;
                            } else {
                                return <ReceiverMessage message={message[1]} sender={message[0]} />;
                            }
                        })}
                    </VStack>
                    {isOwner &&
                    <VStack justify={'flex-start'}>
                        
                        <SettingsDialog
                            userLimit={userLimit}
                            setUserLimit={setUserLimit}
                            checked={checked}
                            setChecked={setChecked}
                        />
                        <PendingInvites invites={invites} acceptInvite={acceptInvite} rejectInvite={rejectInvite} />
                    </VStack>
                    }
                </HStack>
            </VStack>
        </form>
    )
}

export default ChatPage