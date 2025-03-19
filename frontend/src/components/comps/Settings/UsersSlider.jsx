import { HStack, Slider } from '@chakra-ui/react';
import React from 'react';

const UsersSlider = (props) => {
    return (
        <Slider.Root
            width="200px"
            min={2}
            max={8}
            step={1}
            value={[props.userLimit]}
            onValueChange={(e) => props.setUserLimit(e.value)}
        >
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumb index={0}>
                    <Slider.DraggingIndicator
                        layerStyle="fill.solid"
                        top="6"
                        rounded="sm"
                        px="1.5"
                    >
                        <Slider.ValueText />
                    </Slider.DraggingIndicator>
                </Slider.Thumb>
            </Slider.Control>
        </Slider.Root>
    )
}

export default UsersSlider;