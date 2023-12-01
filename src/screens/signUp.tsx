import React from 'react';
import {Center, Heading, Image, ScrollView, Text, useToast, VStack} from "native-base";
import BackgroundImg from "@assets/background.png";
import LogoSVG from "@assets/logo.svg";
import Input from "@components/input";
import Button from "@components/button";
import {useNavigation} from "@react-navigation/native";
import {TAuthNavigatorProps} from "../@types/auth.routes";
import {Controller, useForm} from "react-hook-form";
import z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {Api} from "@utils/axiosConfig";
import axios, {AxiosError} from "axios";

const schema = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(3),
    passwordConfirmation: z.string().min(3),
}).refine((data)=>{
    return (data.password === data.passwordConfirmation)
}, {
    path: ["passwordConfirmation"]
})

interface ISchema extends z.infer<typeof schema>{}


function SignUp() {
    const navigation = useNavigation<TAuthNavigatorProps>()
    const {control, handleSubmit, formState:{ errors }} = useForm<ISchema>({
        resolver: zodResolver(schema)
    })
    const toast = useToast()

    async function signupform({name, password, email}: ISchema){
        try{
            const {data} = await Api.post('/users', {
                name,
                password,
                email,
            })

            navigation.navigate('signIn')

            // console.log(data)
        }catch (e){
            if(axios.isAxiosError(e))
                toast.show({
                    title: e.response?.data.message,
                    bg: "red.600",
                    placement: "top"
                })
        }
    }
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <VStack px={5}  flex={1}>
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
                             fontFamily={"heading"}> Crie sua conta </Heading>

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
                                name={"name"}
                                render={({field: {onChange, onBlur, value}})=> (
                                    <Input
                                        borderWidth={1}
                                        borderColor={errors.name ? "red.600" : "black"}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder={'Nome'}
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
                                        placeholder={'Password'}
                                    />
                                )} />

                    <Controller control={control}
                                name={"passwordConfirmation"}
                                render={({field: {onChange, onBlur, value}})=> (
                                    <Input
                                        borderWidth={1}
                                        borderColor={errors.passwordConfirmation ? "red.600" : "black"}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder={'Password Confirm'}
                                    />
                                )} />



                    <Button onPress={handleSubmit(signupform)} title={'Criar e acessar'} />
                </Center>



                <Center pb={8} flex={1} justifyContent={"flex-end"}>
                    <Button onPress={()=> navigation.navigate('signIn')} title={'Voltar para o Login'} variant={"outline"}/>
                </Center>
            </VStack>
        </ScrollView>
    );
}

export default SignUp;