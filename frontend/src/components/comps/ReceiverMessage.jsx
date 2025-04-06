import { Avatar, AvatarGroup, Box, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const ReceiverMessage = (props) => {
    return (
        <HStack alignSelf={'flex-start'}>
            <AvatarGroup>
                <Avatar.Root>
                    <Avatar.Fallback name={props.sender} />
                </Avatar.Root>
            </AvatarGroup>
            <Box bgColor={props.bgColor} p={3} borderRadius={5} maxW={'30rem'}>
                <VStack align={'flex-start'} gap={0}>
                    <Box borderBottom={'1px solid gray'} w={'100%'}>
                        <Text fontSize="sm" textAlign={'left'} color={'gray.400'}>{props.sender}</Text>
                    </Box>
                    <Text color={props.color}>{props.message}</Text>
                </VStack>
            </Box>
        </HStack>
    )
}

export default ReceiverMessage;