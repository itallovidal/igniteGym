import React from 'react';
import {Center, Heading, ScrollView, Skeleton, Text, useToast, VStack} from "native-base";
import ScreenHeader from "@components/screenHeader";
import UserPhoto from "@components/UserPhoto";
import {TouchableOpacity} from "react-native";
import Input from "@components/input";
import Button from "@components/button";

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'
import {Controller, useForm} from "react-hook-form";
import useAuth from "@hooks/useAuth";

import z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {AppError} from "@utils/AppError";
import {Api} from "@utils/axiosConfig";

const schema = z.object({
    name: z.string({
         required_error: "Informe o nome."
    }),
    password: z.string().min(4, {message: "Senha muito curta."}),
    confirm_password: z.string().min(4, {message: "Senha muito curta."}),
    old_password: z.string().min(4, {message: "Senha muito curta."})
}).refine(({password, confirm_password})=>{
    return password === confirm_password;
}, {
    message: "Senhas não coincidem.",
    path: ["confirm_password"]
})


type TFormDataProps ={
    name: string,
    password: string,
    old_password: string,
    confirm_password: string,
    email: string
}

function Profile() {
    const [isPhotoLoaded, setIsPhotoLoaded] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [userPhoto, setUserPhoto] = React.useState("")
    const toast = useToast()
    setTimeout(()=> setIsPhotoLoaded(true), 2000)
    const {user, updateUserProfile} = useAuth()
    const {control, handleSubmit, formState: {errors}} = useForm<TFormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: zodResolver(schema)
    })

    async function handleUserPhoto(){
        const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: .2,
        })

        if(selectedPhoto.canceled){
            return
        }

        if(selectedPhoto.assets[0].uri){
            const photoInfo = await FileSystem.getInfoAsync(selectedPhoto.assets[0].uri)

            if(photoInfo.exists && (photoInfo.size / 1024 * 2) > 5){
                toast.show({
                    title: "Ops, imagem muito grande!",
                    placement: "top",
                    bgColor:"red.500",
                })
                return
            }

            setUserPhoto(selectedPhoto.assets[0].uri)
        }

    }

    async function handleProfileUpdate(data : TFormDataProps){
        try {
            setIsLoading(true)

            const userUpdated = user
            userUpdated.name = data.name

            await Api.put('/users', data)

            await updateUserProfile(userUpdated)

            toast.show({
                title: "Atualizado com sucesso!",
                placement: "top",
                bgColor: "blue.500"
            })
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

    return (
        <VStack flex={1}>
            <ScreenHeader title={"Perfil"}/>

            <ScrollView>
                <Center mt={6} px={10}>

                    <Skeleton w={32}
                              h={32}
                              rounded={"full"}
                              isLoaded={isPhotoLoaded}
                              startColor={"gray.300"}
                              endColor={"gray.500"}
                    >
                        <UserPhoto size={32}
                                   alt={""}
                                   source={{uri: userPhoto}}
                        />
                    </Skeleton>

                    <TouchableOpacity onPress={handleUserPhoto}>
                        <Text color={"green.500"} fontSize={"md"} fontWeight={"bold"} mt={2} mb={8}>Alterar Foto</Text>
                    </TouchableOpacity>

                    <Controller render={({field: {value, onChange}})=>(
                        <Input
                            onChangeText={onChange}
                            value={value}
                            placeholder={"Nome"}
                            bg={"gray.600"}
                            errorMessage={errors.name?.message}
                        />
                    )} name={"name"} control={control} />

                    <Controller render={({field: {value, onChange}})=>(
                        <Input isDisabled
                               value={value}
                               placeholder={"email"}
                               bg={"gray.600"}/>
                    )} name={"email"} control={control} />


                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color={"gray.200"} fontSize={"md"} mb={2}>
                        Alterar Senha
                    </Heading>

                    <Controller render={({field: {value, onChange}})=>(
                        <Input bg={"gray.600"}
                               value={value}
                               onChangeText={onChange}
                               errorMessage={errors.old_password?.message}                               placeholder={"Senha Antiga"}
                               secureTextEntry/>

                    )} name={"old_password"} control={control} />

                    <Controller render={({field: {value, onChange}})=>(
                        <Input bg={"gray.600"}
                               value={value}
                               onChangeText={onChange}
                               placeholder={"Senha Nova"}
                               errorMessage={errors.password?.message}
                               secureTextEntry/>


                    )} name={"password"} control={control} />

                    <Controller render={({field: {value, onChange}})=>(
                        <Input bg={"gray.600"}
                               value={value}
                               onChangeText={onChange}
                               placeholder={"Confirme a Senha"}
                               errorMessage={errors.confirm_password?.message}
                               secureTextEntry/>

                    )} name={"confirm_password"} control={control} />
                    <Button onPress={handleSubmit(handleProfileUpdate)} title={"atualizar"} mt={4}/>
                </VStack>
            </ScrollView>
        </VStack>
    );
}

export default Profile;