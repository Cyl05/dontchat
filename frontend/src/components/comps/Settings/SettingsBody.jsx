import { Box, Button, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import UsersSlider from './UsersSlider';
import AllowInvitesSwitch from './AllowInvitesSwitch';
import MessageColorPicker from './MessageColorPicker';

const SettingsBody = (props) => {
    return (
        <Box>
            {
                props.disabled == true ?
                null :
                <>
                    <HStack justify={'space-between'} mb={4}>
                        <Text textStyle={'md'}>Allow anyone to join your room: </Text>
                        <AllowInvitesSwitch checked={props.checked} setChecked={props.setChecked} />
                    </HStack>
                </>
            }
            <HStack justify={'space-between'}>
                <MessageColorPicker color={props.color} setColor={props.setColor} />
            </HStack>
        </Box>
    )
}

export default SettingsBody;