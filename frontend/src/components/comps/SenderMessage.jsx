import { Avatar, AvatarGroup, Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

const SenderMessage = (props) => {
  return (
    <HStack alignSelf={'flex-end'}>
        <Box bgColor={'green'} p={3} borderRadius={5} maxW={'30rem'}>
            <Text>{props.message}</Text>
        </Box>
        <AvatarGroup>
            <Avatar.Root>
                <Avatar.Fallback name={props.sender} />
            </Avatar.Root>
        </AvatarGroup>
    </HStack>
  )
}

export default SenderMessage;