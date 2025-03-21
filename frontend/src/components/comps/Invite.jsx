import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { ImCheckmark, ImCross } from "react-icons/im";
import React from 'react';

const Invite = (props) => {
    return (
        <Box w="100%" px={2} borderRadius={4}>
            <HStack w={'100%'} justify={'space-between'}>
                <Text textStyle={'lg'}>{props.name}</Text>
                <HStack>
                    <IconButton
                        size={'xs'}
                        rounded={'full'}
                        colorPalette={'green'}
                        variant={'subtle'}
                        onClick={() => props.acceptInvite(props.name)}
                    >
                        <ImCheckmark />
                    </IconButton>
                    <IconButton
                        size={'xs'}
                        rounded={'full'}
                        colorPalette={'red'}
                        variant={'subtle'}
                        onClick={() => props.rejectInvite(props.name)}
                    >
                        <ImCross />
                    </IconButton>
                </HStack>
            </HStack>
        </Box>
    )
}

export default Invite;