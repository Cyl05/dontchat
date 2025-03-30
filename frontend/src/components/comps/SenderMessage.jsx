import { Avatar, AvatarGroup, Box, HStack, Separator, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const SenderMessage = (props) => {
  return (
    <HStack alignSelf={'flex-end'}>
        <Box bgColor={'green.muted'} p={3} borderRadius={5} maxW={'30rem'}>
          <VStack align={'flex-end'} gap={0}>
            <Box borderBottom={'1px solid gray'} w={'100%'}>
              <Text fontSize="sm" textAlign={'right'} color={'gray.400'}>{props.sender}</Text>
            </Box>
            <Text>{props.message}</Text>
          </VStack>
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