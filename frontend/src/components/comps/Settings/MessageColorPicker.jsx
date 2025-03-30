import { ColorSwatch, HStack, Input, InputGroup } from '@chakra-ui/react';
import React from 'react';


const MessageColorPicker = (props) => {
    return (
        // <HStack>
        <HStack gap={0}>
            <InputGroup startElement="#" mr={-9}> 
                <Input variant={'subtle'} w={'70%'} onChange={(e) => props.setColor(e.target.value)} value={props.color} />
            </InputGroup>
            <ColorSwatch value={"#"+props.color} ml={0} />
        </HStack>
        // </HStack>
    )
}

export default MessageColorPicker;