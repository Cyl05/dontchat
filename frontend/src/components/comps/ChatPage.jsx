import React from 'react';
import socket from '../../socket.js';
import { Box, Button, Highlight, HStack, IconButton, Input, Separator, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import SenderMessage from './SenderMessage.jsx';
import ReceiverMessage from './ReceiverMessage.jsx';
import SettingsDialog from './Settings/SettingsDialog.jsx';
import PendingInvites from './PendingInvites.jsx';
import { AnimatedBackground } from 'animated-backgrounds';
import { IoMdArrowBack } from 'react-icons/io';
import { LightMode } from '../ui/color-mode.jsx';
import { FaArrowDown } from 'react-icons/fa';

const ChatPage = () => {
    const [inputVal, setInputVal] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [username, setUsername] = React.useState(JSON.parse(localStorage.getItem("username")));
    const [isOwner, setIsOwner] = React.useState(false);
    const [invites, setInvites] = React.useState([]);
    const messagesEndRef = React.useRef(null);

    const [checked, setChecked] = React.useState(true);
    const [color, setColor] = React.useState({bgColor: "white", color: "black"});

    const { roomName } = useParams();
    const navigate = useNavigate();
    socket.emit("connectRoom", roomName, checked, username.username);

    const handleBeforeUnload = () => {
        socket.emit("client-leaving", username.username, roomName);
    };

    const acceptInvite = (user) => {
        setInvites(invites.filter(invite => invite != user));
        socket.emit("accepted user", user, roomName);
    };

    const rejectInvite = (user) => {
        setInvites(invites.filter(invite => invite != user));
        console.log(user);
        socket.emit("rejected user", user);
    }

    const backButtonClick = () => {
        navigate("/");
        handleBeforeUnload();
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    React.useEffect(() => {
        socket.on("message", (msg, userName, msgBgColor, msgColor) => {
            setMessages((prev) => [...prev, {
                sender: userName, 
                content: msg, 
                type: "message",
                bgColor: msgBgColor,
                color: msgColor
            }]);
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
                socket.emit("join request", user, roomName);
                navigate("/waiting");
            }
        });

        socket.on("new owner", (user) => {
            if (username.user == user) {
                setIsOwner(true);
            }
        });

        socket.on("send room join message", (user) => {
            console.log(`${user} joined`);
            setMessages((prev) => [...prev, {sender: user, content: null, type:"join"}]);
        });

        socket.on("send room leave message", (user, room) => {
            setMessages((prev) => [...prev, {sender: user, content: null, type:"leave"}]);
        });

        window.addEventListener("unload", handleBeforeUnload);
        window.addEventListener("popstate", handleBeforeUnload);

        return () => {
            socket.off("message");
        };
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", inputVal, roomName, username.username, color.bgColor, color.color);
        setInputVal("");
    }

    const handleEnter = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            socket.emit("message", inputVal, roomName, username.username, color.bgColor, color.color);
            setInputVal("");
        }
    }


    return (
        <Box justifyItems={'center'} alignContent={'center'} h={'100vh'} position={'relative'}>
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
                        <HStack justify={'flex-start'}>
                            <SettingsDialog
                                checked={checked}
                                setChecked={setChecked}
                                disabled={!isOwner}
                                color={color}
                                setColor={setColor}
                            />
                            {isOwner ?
                                <PendingInvites invites={invites} acceptInvite={acceptInvite} rejectInvite={rejectInvite} />
                                : <Box></Box>
                            }
                        </HStack>
                    </Box>
                    <VStack h={'70vh'} w={'97%'} py={5} overflow="auto" px={5} mt={2}>
                        {messages.map((message) => {
                            if (message.type === "message") {
                                if (message.sender == username.username) {
                                    return (
                                        <SenderMessage 
                                            message={message.content} 
                                            sender={message.sender}
                                            color={message.color}
                                            bgColor={message.bgColor}
                                        />
                                    );
                                } else {
                                    return (
                                        <ReceiverMessage 
                                            message={message.content}
                                            sender={message.sender} 
                                            color={message.color}
                                            bgColor={message.bgColor}
                                        />
                                    );
                                }
                            } else if (message.type == "join") {
                                console.log("yes he joined");
                                return (
                                    <Box px={2} py={1} bgColor={'white'} borderRadius={'full'}>
                                        <Text color={'black'} fontSize={'sm'}>{message.sender} has joined the room</Text>
                                    </Box>
                                );
                            } else if (message.type == "leave") {
                                return (
                                    <Box px={2} py={1} bgColor={'white'} borderRadius={'full'}>
                                        <Text color={'black'} fontSize={'sm'}>{message.sender} has left the room</Text>
                                    </Box>
                                );
                            }
                        })}
                        <div ref={messagesEndRef} />
                    </VStack>
                    <Button
                        w={'97%'}
                        variant={'outline'}
                        onClick={scrollToBottom}
                        my={2}
                    >
                        Scroll to Bottom
                    </Button>
                    <HStack mx={'auto'} justify={'center'} mb={5} mt={2} w={'97%'}>
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