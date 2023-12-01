import React from 'react';
import {Center, Spinner} from "native-base";

function Loading() {
    return (
        <Center flex={1} bg={'gray.700'}>
            <Spinner></Spinner>
        </Center>
    );
}

export default Loading;