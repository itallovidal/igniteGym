import React from 'react';
import {HStack, Text, IPressableProps, Pressable} from "native-base";

type Props = IPressableProps & {
    name: string,
    isActive: boolean,

}

function Group({name, isActive, ...props}: Props) {
    return (
        <HStack>
            <Pressable mr={3}
                       w={24}
                       h={10}
                       bg={"gray.600"}
                       rounded={"md"}
                       justifyContent={"center"}
                       alignItems={"center"}
                       isPressed={isActive}
                       _pressed={{
                           borderColor: "green.500",
                           borderWidth: 1
                       }}
                       {...props}
            >
                <Text color={ isActive ? "green.500" : "gray.200"} textTransform={"uppercase"} fontWeight={"bold"} fontSize={"xs"}>
                    {name}
                </Text>
            </Pressable>
        </HStack>
    );
}

export default Group;