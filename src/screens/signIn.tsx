import {VStack, Image, Text, Center, Heading, ScrollView, useToast} from 'native-base'
import BackgroundImg from '@assets/background.png'

import LogoSVG from '@assets/logo.svg'
import Input from "@components/input";
import Button from "@components/button";
import {useNavigation} from "@react-navigation/native";
import {TAuthNavigatorProps} from "../@types/auth.routes";
import useAuth from "@hooks/useAuth";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import React, {useState} from "react";
import {AppError} from "@utils/AppError";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
})

interface ISchema extends z.infer<typeof schema>{}


function SignIn() {
    const navigation  = useNavigation<TAuthNavigatorProps>()
    const {control, handleSubmit, formState:{ errors }} = useForm<ISchema>({
        resolver: zodResolver(schema)
    })
    const {signIn} = useAuth()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)


    async function handleSignIn({email, password}: ISchema){
        setIsLoading(true)
        try {
            await signIn(email, password)

        }catch (e){
            const isAppError = e instanceof AppError

            const title = isAppError ? e.message : "Não foi possível entrar."
            toast.show({
                title,
                placement: "top",
                bgColor: "red.600"
            })

            setIsLoading(false)
        }
    }
    return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <VStack px={5} flex={1}>
            <Image alt={'tela de login '}
                   resizeMode={'contain'}
                   position={'absolute'}
                   source={BackgroundImg}/>

            <Center my={24}>
                <LogoSVG/>
                <Text color={"gray.100"} fontSize={"sm"}>Treine sua mente e o seu corpo</Text>
            </Center>

            <Center>
                <Heading color={"gray.100"}
                         fontSize={"xl"}
                         mb={6}
                         fontFamily={"heading"}> Acesse sua conta </Heading>

                <Controller control={control}
                            name={"email"}
                            render={({field: {onChange, onBlur, value}})=> (
                                <Input
                                    borderWidth={1}
                                    borderColor={errors.email ? "red.600" : "black"}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder={'Email'}
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"}
                                />
                            )} />

                <Controller control={control}
                            name={"password"}
                            render={({field: {onChange, onBlur, value}})=> (
                                <Input
                                    borderWidth={1}
                                    borderColor={errors.password ? "red.600" : "black"}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder={'Senha'}
                                    secureTextEntry
                                    autoCapitalize={"none"}
                                />
                            )} />


                <Button isLoading={isLoading} onPress={handleSubmit(handleSignIn)} title={'Acessar'} />
            </Center>


            <Center mb={8} mt={8} flex={1} justifyContent={"flex-end"} >
                <Text mb={6} color={'gray.100'} fontSize={"sm"} fontFamily={"body"}>Não possui acesso?</Text>
                <Button onPress={()=> navigation.navigate('signUp')} title={'Criar conta'} variant={"outline"}/>
            </Center>
        </VStack>
    </ScrollView>
    );
}

export default SignIn;