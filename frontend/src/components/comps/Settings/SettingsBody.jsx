import { Box, Button, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import UsersSlider from './UsersSlider';
import AllowInvitesSwitch from './AllowInvitesSwitch';

const SettingsBody = (props) => {
    return (
        <Box>
            <HStack justify={'space-between'} mb={4}>
                <Text textStyle={'md'}>Maximum users in room: </Text>
                <UsersSlider userLimit={props.userLimit} setUserLimit={props.setUserLimit} />
            </HStack>
            <HStack justify={'space-between'}>
                <Text textStyle={'md'}>Allow anyone to join your room: </Text>
                <AllowInvitesSwitch checked={props.checked} setChecked={props.setChecked} />
            </HStack>
        </Box>
    )
}

export default SettingsBody;