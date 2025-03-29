import React from 'react';
import socket from '../../socket.js';
import { Box, Button, Highlight, HStack, IconButton, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import SenderMessage from './SenderMessage.jsx';
import ReceiverMessage from './ReceiverMessage.jsx';
import SettingsDialog from './Settings/SettingsDialog.jsx';
import PendingInvites from './PendingInvites.jsx';
import { AnimatedBackground } from 'animated-backgrounds';
import { IoMdArrowBack } from 'react-icons/io';
import { LightMode } from '../ui/color-mode.jsx';

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

    const handleBeforeUnload = () => {
        socket.emit("client-leaving", username.username, roomName);
        setTimeout(() => socket.disconnect(), 100); // Small delay to ensure event is sent
    };

    const acceptInvite = (user) => {
        setInvites(invites.filter(invite => invite != user));
        socket.emit("accepted user", user, roomName);
    };

    const rejectInvite = (user) => {
        setInvites(invites.filter(invite => invite != user));
        socket.emit("rejected user", user);
    }

    const backButtonClick = () => {
        navigate("/");
        handleBeforeUnload();
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
        });

        socket.on("new owner", (user) => {
            console.log("new owner");
            if (username.user == user) {
                setIsOwner(true);
            }
        });

        window.addEventListener("unload", handleBeforeUnload);
        window.addEventListener("popstate", handleBeforeUnload);

        return () => {
            socket.off("message");
        };
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", inputVal, roomName, username.username);
        setInputVal("");
    }

    const handleEnter = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            socket.emit("message", inputVal, roomName, username.username);
            setInputVal("");
        }
    }

    return (
        <Box justifyItems={'center'} alignContent={'center'} h={'100vh'}>
            <Box
                w={'60%'}
                h={'100vh'}
                borderRadius={10}
                p={4}
                justifyItems={'center'}
                shadow={'sm'}
                border={'2px solid white'}
            >
                <VStack w={'95%'} alignContent={'center'}>
                    <Box
                        w={'100%'}
                        h={'7vh'}
                        borderRadius={'md'}
                        border={'2px solid white'}
                        bgColor={'gray.500'}
                        px={2}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        gap={4}
                    >
                        <LightMode>
                            <IconButton variant={'subtle'} colorPalette={'gray'} onClick={backButtonClick}>
                                <IoMdArrowBack />
                            </IconButton>
                        </LightMode>
                        
                        <Text textStyle={'xl'} color={'black'}>
                            Room Name: {roomName}
                        </Text>
                        {isOwner ?
                            <HStack justify={'flex-start'}>

                                <SettingsDialog
                                    userLimit={userLimit}
                                    setUserLimit={setUserLimit}
                                    checked={checked}
                                    setChecked={setChecked}
                                />
                                <PendingInvites invites={invites} acceptInvite={acceptInvite} rejectInvite={rejectInvite} />
                            </HStack>
                            : <Box></Box>
                        }
                    </Box>
                    <VStack h={'78vh'} w={'97%'} py={5}>
                        {messages.map((message) => {
                            if (message[0] == username.username) {
                                return <SenderMessage message={message[1]} sender={message[0]} />;
                            } else {
                                return <ReceiverMessage message={message[1]} sender={message[0]} />;
                            }
                        })}
                    </VStack>
                    <HStack mx={'auto'} justify={'center'} my={5} w={'100%'}>
                        <Input
                            w={'90%'}
                            mr={2}
                            onChange={(e) => setInputVal(e.target.value)} value={inputVal} 
                            border={'2px solid white'}
                            onKeyDown={(e) => handleEnter(e)}
                        />
                        <Button onClick={handleSubmit}>Send</Button>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    )
}

export default ChatPage;