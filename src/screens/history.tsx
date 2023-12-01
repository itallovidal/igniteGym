import React from 'react';
import {Heading, SectionList, VStack, Text, useToast} from "native-base";
import ScreenHeader from "@components/screenHeader";
import HistoryCard from "@components/historyCard";
import {AppError} from "@utils/AppError";
import {Api} from "@utils/axiosConfig";
// @ts-ignore
import {HistoryByDayDTO} from "@dtos/HistoryByDayDTO";
import {useFocusEffect} from "@react-navigation/native";

function History() {
    const [isLoading, setIsLoading] = React.useState(true)
    const [exercises, setExercises] = React.useState<HistoryByDayDTO[]>([])
    const toast = useToast()



    async function fetchHistory(){
        try {
            setIsLoading(true)

            const response = await Api.get('/history')
            setExercises(response.data)

        }catch (e){
            const isAppError = e instanceof AppError

            const title = isAppError ? e.message : `Não foi possível resgistrar`

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            })
        }finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(React.useCallback(()=>{
        fetchHistory()
    }, []))



    return (
        <VStack flex={1}>
            <ScreenHeader title={"historico"}/>

            <SectionList sections={exercises}
                         ListEmptyComponent={()=> <Text color={"gray.100"} textAlign={"center"}>
                             Sem exercícios. {'\n'}
                             Vamos treinar hoje?
                         </Text>}
                         contentContainerStyle={exercises.length === 0 && {
                             flex: 1,
                             justifyContent: "center"
                         }}
                         keyExtractor={(item)=> item.id}
                         mx={5}
                         renderItem={({item})=> <HistoryCard data={item}/>}
                         renderSectionHeader={({section})=> <Heading color={"white"}
                                                                     fontSize={"lg"}
                                                                     mt={10}
                                                                     mb={3}
                                                                     ml={5}
                                                                    >{section.title}</Heading>}
            />

        </VStack>
    );
}

export default History;