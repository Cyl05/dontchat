import { Avatar, AvatarGroup, Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

const ReceiverMessage = (props) => {
    return (
        <HStack alignSelf={'flex-start'}>
            <AvatarGroup>
                <Avatar.Root>
                    <Avatar.Fallback name={props.sender} />
                </Avatar.Root>
            </AvatarGroup>
            <Box bgColor={'green'} p={3} borderRadius={5} maxW={'30rem'}>
                <Text>{props.message}</Text>
            </Box>
        </HStack>
    )
}

export default ReceiverMessage;