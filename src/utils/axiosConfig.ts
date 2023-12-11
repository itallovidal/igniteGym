import axios, {AxiosError, AxiosInstance} from "axios";
import {AppError} from "@utils/AppError";
import {getStoredToken, storeToken} from "@storage/storageAuthToken";


type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut)=> () => void
}




export const Api = axios.create({
    // url base
    baseURL: 'http://192.168.1.138:3333'
}) as APIInstanceProps

type PromiseType = {
    onSuccess: (token: string)=> void
    onFailure: (error: AxiosError)=> void
}

let failedQueue: Array<PromiseType> = []
let isRefreshing = false

Api.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = Api.interceptors.response.use(response => response, async (requestError) =>{
        if(requestError.response.status === 401){
            if(requestError.response.data.message === "token.expired" || requestError.response.data.message === "token.invalid"){
                const {refreshToken} = await getStoredToken()

                if(!refreshToken){
                    signOut()
                    return Promise.reject(requestError)
                }

                const originalRequestConfig = requestError.config
                if(isRefreshing){
                    return new Promise((resolve, reject)=> {
                        failedQueue.push({
                            onSuccess: (token: string)=> {
                                originalRequestConfig.headers = {'Authorization': `Bearer ${token}`}
                                resolve(Api(originalRequestConfig))
                            },
                            onFailure: (error: AxiosError)=> {
                                reject(error)
                            }
                        })
                    })
                }

                isRefreshing = true
                
                return new Promise(async(resolve, reject)=>{
                    try{
                        const {data} = await Api.post('/sessions/refresh-token', {refreshToken})
                        await storeToken(data.token, data.refresh_token)


                        if(originalRequestConfig.data){
                            originalRequestConfig.data  = JSON.parse(originalRequestConfig.data)
                        }

                        originalRequestConfig.headers = {'Authorization': `Bearer ${data.token}`}

                        Api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

                        failedQueue.forEach(request=>{
                            request.onSuccess(data.token)
                        })

                        resolve(Api(originalRequestConfig))
                    }catch (e: any){
                        failedQueue.forEach(request => {
                            request.onFailure(e)
                        })

                        signOut()
                        reject(e)
                    }finally {
                        isRefreshing = false
                        failedQueue = []
                    }
                })
            }

            signOut()
        }



        if(requestError.response && requestError.response.data){
            return Promise.reject(new AppError(requestError.response.data.message))
        }
        else{
            return Promise.reject(requestError)
        }
    })

    return ()=>{
        Api.interceptors.response.eject(interceptTokenManager)
    }
}

