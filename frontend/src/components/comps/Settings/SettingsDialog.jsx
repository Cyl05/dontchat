import React from 'react';
import { Button, CloseButton, Dialog, IconButton, Portal } from "@chakra-ui/react"
import { IoMdSettings } from 'react-icons/io';
import SettingsBody from './SettingsBody';

const SettingsDialog = (props) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <IconButton w={'5%'}>
                    <IoMdSettings />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Settings</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <SettingsBody 
                                userLimit={props.userLimit} 
                                setUserLimit={props.setUserLimit}
                                checked={props.checked}
                                setChecked={props.setChecked}
                                disabled={props.disabled}
                                color={props.color}
                                setColor={props.setColor}
                            />
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
};


export default SettingsDialog;