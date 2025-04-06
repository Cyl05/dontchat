import { HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { RxLetterCaseCapitalize } from 'react-icons/rx';


const MessageColorPicker = (props) => {
    return (
        <VStack align={'flex-start'} gap={5}>
            <Text textStyle={'md'}>Message Color:</Text>
            <HStack>
                <IconButton
                    rounded={'full'}
                    size={'md'}
                    colorPalette={props.color.bgColor === "white" ? 'green' : null}
                    onClick={() => props.setColor({bgColor: 'white', color: 'black'})}
                >
                    {props.color.bgColor === "white" ? <FaCheck /> : <RxLetterCaseCapitalize />}
                </IconButton>

                <IconButton
                    rounded={'full'}
                    size={'md'}
                    colorPalette={props.color.bgColor === "red" ? 'green' : 'red'}
                    onClick={() => props.setColor({bgColor: 'red', color: 'white'})}
                >
                    {props.color.bgColor === "red" ? <FaCheck /> : <RxLetterCaseCapitalize />}
                </IconButton>

                <IconButton
                    rounded={'full'}
                    size={'md'}
                    bgColor={props.color.bgColor !== 'green' ? '#006400' : null}
                    colorPalette={props.color.bgColor === "green" ? 'green' : null}
                    onClick={() => props.setColor({bgColor: 'green', color: 'white'})}
                >
                    {props.color.bgColor === "green" ? <FaCheck /> : <RxLetterCaseCapitalize style={{ color: 'white' }} />}
                </IconButton>

                <IconButton
                    rounded={'full'}
                    size={'md'}
                    colorPalette={props.color.bgColor === "blue" ? 'green' : 'blue'}
                    onClick={() => props.setColor({bgColor: 'blue', color: 'white'})}
                >
                    {props.color.bgColor === "blue" ? <FaCheck /> : <RxLetterCaseCapitalize />}
                </IconButton>

                <IconButton
                    rounded={'full'}
                    size={'md'}
                    colorPalette={props.color.bgColor === "orange" ? 'green' : 'orange'}
                    onClick={() => props.setColor({bgColor: 'orange', color: 'black'})}
                >
                    {props.color.bgColor === "orange" ? <FaCheck /> : <RxLetterCaseCapitalize />}
                </IconButton>

                <IconButton
                    rounded={'full'}
                    size={'md'}
                    colorPalette={props.color.bgColor === "yellow" ? 'green' : 'yellow'}
                    onClick={() => props.setColor({bgColor: 'yellow', color: 'black'})}
                >
                    {props.color.bgColor === "yellow" ? <FaCheck /> : <RxLetterCaseCapitalize />}
                </IconButton>

                <IconButton
                    rounded={'full'}
                    size={'md'}
                    colorPalette={props.color.bgColor === "purple" ? 'green' : 'purple'}
                    onClick={() => props.setColor({bgColor: 'purple', color: 'white'})}
                >
                    {props.color.bgColor === "purple" ? <FaCheck /> : <RxLetterCaseCapitalize />}
                </IconButton>
            </HStack>
        </VStack>
    )
}

export default MessageColorPicker;