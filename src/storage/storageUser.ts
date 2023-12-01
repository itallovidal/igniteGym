import {UserDTO} from "../DTOs/UserDTO";
import {USER_STORAGE} from "@storage/storageConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeUser(user: UserDTO){
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function getStoredUser(){

    const storage  = await AsyncStorage.getItem(USER_STORAGE)

    const stored: UserDTO = storage ? JSON.parse(storage): {}

    return stored
}

export async function deleteStored(){
    await AsyncStorage.clear()
}