import {AUTH_STORAGE} from "@storage/storageConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeToken(token: string){
    await AsyncStorage.setItem(AUTH_STORAGE, token)
}

export async function getStoredToken(){
    const token  = await AsyncStorage.getItem(AUTH_STORAGE)

    return token
}

