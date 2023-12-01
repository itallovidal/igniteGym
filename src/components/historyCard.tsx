import React from 'react';
import {Heading, HStack, VStack, Text} from "native-base";
// @ts-ignore
import {HistoryDTO} from "@dtos/HistoryDTO";

interface HistoryProps{
    data: HistoryDTO
}

function HistoryCard({data} : HistoryProps) {

    console.log(data)
    return (
        <HStack w={"full"} px={5} py={4} mb={3} bg={"gray.600"} rounded={"md"} alignItems={"center"} justifyContent={"space-between"}>
            <VStack flex={1} mr={5}>
                <Heading flexShrink={1} color={"white"} fontSize={"md"} textTransform={"capitalize"}>{data.group}</Heading>
                <Text color={"gray.100"} fontSize={"lg"} numberOfLines={1}>{data.name}</Text>
            </VStack>

            <Text color={"gray.300"} fontSize={"md"}>{data.created_at}</Text>
        </HStack>
    );
}

export default HistoryCard;