import React from 'react';
import { Button, CloseButton, Dialog, IconButton, Portal, Text, VStack } from "@chakra-ui/react";
import { IoPersonAdd } from "react-icons/io5";
import Invite from './Invite';

const pendingInvites = (props) => {
    let key = 0;
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <IconButton>
                    <IoPersonAdd />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Pending Invites</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack>
                                {props.invites.length != 0 ? 
                                    (props.invites.map((invite) => {
                                        return (
                                            <Invite
                                                key={key++}
                                                name={invite} 
                                                acceptInvite={props.acceptInvite} 
                                                rejectInvite={props.rejectInvite}
                                            />
                                        );
                                    })) :
                                    <Text>No invites to display</Text>
                                }
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default pendingInvites;