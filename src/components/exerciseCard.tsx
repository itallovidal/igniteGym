import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from "react-native";
import {Heading, HStack, Image, VStack, Text, Icon} from "native-base";
import {CaretRight} from "phosphor-react-native";
// @ts-ignore
import {ExerciseDTO} from "@dtos/ExerciseDTO";
import {Api} from "@utils/axiosConfig";


type Props = TouchableOpacityProps & {
    data: ExerciseDTO
}
function ExerciseCard({data, ...props}: Props) {
    return (
        <TouchableOpacity {...props}>
            <HStack bg={"gray.500"} alignItems={"center"} p={2} pr={4} rounded={"md"} mb={5}>
                <Image source={{uri: `${Api.defaults.baseURL}/exercise/thumb/${data.thumb}`}}
                        alt={""}
                       w={16}
                       h={16}
                       rounded={"md"}
                       mr={5}
                       resizeMode={"cover"}
                />

                <VStack flex={1}>
                    <Heading color={"gray.200"} fontSize={"lg"} >
                        {data.name}
                    </Heading>

                    <Text fontSize={"md"} color={"gray.200"} numberOfLines={1}>
                        {data.series} séries de {data.repetitions} repetições
                    </Text>
                </VStack>
                <Icon
                    as={CaretRight}
                    color={"gray.300"}
                />
            </HStack>
        </TouchableOpacity>
    );
}

export default ExerciseCard;