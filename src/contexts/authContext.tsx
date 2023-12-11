import React, {ReactNode, useState} from 'react';

import {createContext} from "react";
import {UserDTO} from "../DTOs/UserDTO";
import {Api} from "@utils/axiosConfig";
import {deleteStored, getStoredUser, storeUser} from "@storage/storageUser";
import {getStoredToken, storeToken} from "@storage/storageAuthToken";



interface IContextProps {
    user: UserDTO,
    signIn: (email: string, password: string) => Promise<void>,
    signOut: ()=> Promise<void>,
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>
}

interface AuthContextProviderProps{
    children: ReactNode
}

export const AuthContext = createContext<IContextProps>({} as IContextProps)
function AuthContextProvider({children}: AuthContextProviderProps) {
    const [user, setUser] = useState({} as UserDTO)

    async function userAndTokenUpdate(user: UserDTO, token: string){
        try {
            setUser(user)
            Api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }catch (error){
            throw error
        }

    }
    async function storageUserAndToken(user: UserDTO, token: string, refreshToken: string){
        try {
            await storeUser(user)
            await storeToken(token, refreshToken)
        }catch (error)
        {
            throw error
        }
    }

    React.useEffect(()=>{
        loadUserData();
    }, [])

    React.useEffect(()=>{
        const subscribe = Api.registerInterceptTokenManager(signOut)

        return ()=>{
            subscribe()
        }
    }, [signOut])

    async function updateUserProfile(userUpdated: UserDTO){
        try {
            setUser(userUpdated)
            await storeUser(userUpdated)
        }catch(e){
            throw e
        }
    }
    async function loadUserData(){
        const user = await getStoredUser()
        const { token } = await getStoredToken()

        if(token && user ){
            await userAndTokenUpdate(user, token)
        }
    }

    async function signIn(email: string, password: string){

        try{
            const {data} = await Api.post('/sessions', {email, password})

            if(data.user && data.token && data.refreshToken){
                await storageUserAndToken(data.user, data.token, data.refreshToken)
                await userAndTokenUpdate(data.user, data.token)
            }
        }catch (e){
            throw e;
        }


    }

    async function signOut(){
        await deleteStored()
        setUser({} as UserDTO)
    }

    return (
        <AuthContext.Provider value={{user, signIn, signOut, updateUserProfile}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;