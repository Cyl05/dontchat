import React from 'react';
import { Switch } from "@chakra-ui/react"
import { HiCheck, HiX } from "react-icons/hi"

const AllowInvitesSwitch = (props) => {
    return (
        <Switch.Root
            size="lg"
            colorPalette={'green'}
            checked={props.checked}
            onCheckedChange={() => props.setChecked(prev => (!prev))}
        >
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb>
                    <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                        <HiCheck />
                    </Switch.ThumbIndicator>
                </Switch.Thumb>
            </Switch.Control>
        </Switch.Root>
    )
}

export default AllowInvitesSwitch;