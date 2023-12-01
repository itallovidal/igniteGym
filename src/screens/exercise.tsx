import React from 'react';
import {Image, Heading, HStack, Icon, Text, VStack, Box, ScrollView, useToast} from "native-base";
import {TouchableOpacity} from "react-native";
import {ArrowLeft} from "phosphor-react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {TAppNavigatorProps} from "../@types/app.routes";

import BodyIcon from "@assets/body.svg"
import SeriesIcon from "@assets/series.svg"
import RepetitionIcon from "@assets/repetitions.svg"
import Button from "@components/button";
import {Api} from "@utils/axiosConfig";
import {AppError} from "@utils/AppError";
import {ExerciseDTO} from "@dtos/ExerciseDTO";
import Loading from "@components/Loading";

type TRouteParams = {
    exerciseId: string
}

function Exercise() {
    const [isLoading, setIsLoading] = React.useState(true)
    const [sendingRegister, setSendingRegister] = React.useState(false)
    const [exercise, setExercise] = React.useState<ExerciseDTO>()
    const toast = useToast()
    const route = useRoute()
    const {exerciseId} = route.params as TRouteParams

    const navigation = useNavigation<TAppNavigatorProps>()
    function handleGoBack(){
        navigation.goBack()
    }

    React.useEffect(()=>{
        fetchExerciseDetails()
    }, [exerciseId])


    async function fetchExerciseDetails(){
        try {
            setIsLoading(true)
            const response = await Api.get(`/exercises/${exerciseId}`)
            setExercise(response.data)

        }catch (e){
            const isAppError = e instanceof AppError

            const title = isAppError ? e.message : `Não foi possível carregar`

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            })
        }finally {
            setIsLoading(false)
        }
    }

    async function handleExerciseHistory(){
        setSendingRegister(true)
        try{

            await Api.post('/history', {
                exercise_id: exerciseId
            })

            toast.show({
                title: "Parabéns! Exercício Registrado",
                placement: "top",
                bgColor: "green.500"
            })
        }catch(e){
            const isAppError = e instanceof AppError

            const title = isAppError ? e.message : `Não foi possível resgistrar`

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            })
        }finally {
            setSendingRegister(false)
        }
    }

    return (
        <VStack flex={1}>
            <ScrollView>
                <VStack px={8} bg={"gray.600"} pt={12}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Icon as={ArrowLeft} color={"green.500"} size={6}/>
                    </TouchableOpacity>

                    <HStack justifyContent={"space-between"} mt={4} mb={8} alignItems={"center"}>
                        <Heading color={"gray.100"} fontSize={"lg"}>{exercise?.name}</Heading>

                        <HStack alignItems={"center"}>
                            <BodyIcon/>
                            <Text flexShrink={1} color={"gray.200"} textTransform={"capitalize"} mt={1}> {exercise?.group} </Text>
                        </HStack>
                    </HStack>
                </VStack>

                {isLoading ? <Loading/> :
                    <VStack p={8}>
                        <Image source={{uri: `${Api.defaults.baseURL}/exercise/demo/${exercise?.demo}`}} h={80}
                               w={"full"}
                               alt={""}
                               rounded={"lg"}
                               resizeMode={"cover"}
                               mb={3}
                        />

                        <Box bg={"gray.600"} rounded={"md"} pb={4} px={4}>
                            <HStack alignItems={"center"} justifyContent={"space-around"} mb={6} mt={5}>
                                <HStack>
                                    <SeriesIcon/>
                                    <Text color={"gray.200"} ml={2}>{exercise?.series}</Text>
                                </HStack>
                                <HStack>
                                    <RepetitionIcon/>
                                    <Text color={"gray.200"} ml={2}>{exercise?.repetitions}</Text>
                                </HStack>
                            </HStack>

                            <Button title={"Marcar como Realizado"}
                                    isLoading={sendingRegister}
                                    onPress={handleExerciseHistory}
                            />
                        </Box>

                    </VStack>

                }



            </ScrollView>
        </VStack>
    );
}

export default Exercise;