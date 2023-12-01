import React from 'react';
import {FlatList, Heading, HStack, Text, VStack, useToast} from "native-base";
import HomeHeader from "@components/homeHeader";
import Group from "@components/group";
import ExerciseCard from "@components/exerciseCard";
import {useNavigation, useFocusEffect} from "@react-navigation/native";
import {TAppNavigatorProps} from "../@types/app.routes";
import {AppError} from "@utils/AppError";
import {Api} from "@utils/axiosConfig";
import {ExerciseDTO} from "@dtos/ExerciseDTO";
import Loading from "@components/Loading";

function Home() {
    const [isLoading, setIsLoading] = React.useState(true)
    const [groupSelected, setGroupSelected] = React.useState("costas")
    const [groups, setGroups] = React.useState<string[]>([])
    const [exercises, setExercises] = React.useState<ExerciseDTO[]>([])
    const toast = useToast()

    const navigation = useNavigation<TAppNavigatorProps>()
    function handleOpenDetais(id : string){
        navigation.navigate("exercise", {
            exerciseId: id
        })
    }

    async function fetchGroups(){
        try {
            const response = await Api.get('/groups')
            setGroups(response.data)

        }catch (e){
            const isAppError = e instanceof AppError

            const title = isAppError ? e.message : `Não foi possível carregar`

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            })
        }
    }

    async function fetchExercisesByGroup(){
        try {
            setIsLoading(true)
            const response = await Api.get(`/exercises/bygroup/${groupSelected}`)
            setExercises(response.data)

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

    React.useEffect(()=>{
        fetchGroups()
    })

    useFocusEffect(React.useCallback(()=>{
        fetchExercisesByGroup()
    },[groupSelected]))

    return (
        <VStack flex={1}>
            <HomeHeader/>

            <FlatList data={groups}
                      keyExtractor={item => item}
                      renderItem={({item})=> <Group isActive={groupSelected === item}
                                                    name={item}
                                                    onPress={()=> setGroupSelected(item)}/>}
                      horizontal
                      my={6}
                      minH={10}
                      maxH={10}
                      px={8}
            />

            {
                isLoading ? <Loading/> :
                <VStack px={8}>
                <HStack mb={5} justifyContent={"space-between"}>
                    <Heading color={"gray.200"} fontSize={"md"}>
                        Exercícios
                    </Heading>

                    <Text color={"gray.200"} fontSize={"md"}>
                        {exercises.length}
                    </Text>
                </HStack>

                <FlatList data={exercises}
                          keyExtractor={item => item.id}
                          renderItem={({item})=> <ExerciseCard data={item} onPress={()=> handleOpenDetais(item.id)}/>}
                          my={6}
                          showsVerticalScrollIndicator={false}

                />
            </VStack>
            }
        </VStack>
    );
}

export default Home;