import React, {ReactNode, useState} from 'react';

import {createContext} from "react";
import {UserDTO} from "../DTOs/UserDTO";
import {Api} from "@utils/axiosConfig";
import {deleteStored, getStoredUser, storeUser} from "@storage/storageUser";
import {getStoredToken, storeToken} from "@storage/storageAuthToken";



interface IContextProps {
    user: UserDTO,
    signIn: (email: string, password: string) => Promise<void>,
    signOut: ()=> Promise<void>
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
    async function storageUserAndToken(user: UserDTO, token: string){
        try {
            await storeUser(user)
            await storeToken(token)
        }catch (error)
        {
            throw error
        }
    }

    React.useEffect(()=>{
        loadUserData();
    }, [])
    async function loadUserData(){
        const user = await getStoredUser()
        const token = await getStoredToken()

        if(token && user){
            await userAndTokenUpdate(user, token)
        }
    }

    async function signIn(email: string, password: string){

        try{
            const {data} = await Api.post('/sessions', {email, password})
            // console.log("=>")
            // console.log(data)
            if(data.user && data.token){
                await storageUserAndToken(data.user, data.token)
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
        <AuthContext.Provider value={{user, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;