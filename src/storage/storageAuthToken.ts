import {AUTH_STORAGE} from "@storage/storageConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";


type StorageAuthToken ={
    token: string,
    refreshToken: string
}

export async function storeToken(token: string, refreshToken: string){
    await AsyncStorage.setItem(AUTH_STORAGE, JSON.stringify({
        token, refreshToken
    }))
}

export async function getStoredToken(){
    const response  = await AsyncStorage.getItem(AUTH_STORAGE)

    const {token, refreshToken} : StorageAuthToken = response ? JSON.parse(response) : {}

    return {token, refreshToken}
}

