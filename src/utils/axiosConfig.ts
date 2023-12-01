import axios from "axios";
import {AppError} from "@utils/AppError";

export const Api = axios.create({
    // url base
    baseURL: 'http://192.168.1.138:3333'
})

Api.interceptors.response.use(response => response, error =>{
    if(error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message))
    }
    else{
        return Promise.reject(error)
    }
})