import axios, { AxiosError, AxiosInstance } from "axios";
import { RequestStatus } from "../types/types";
import { errorMessages } from "../responses/responses";


export const SERVER_IP: string = "localhost";
export const SERVER_PORT: number = 3000;
let instance: AxiosInstance;


const axiosInstance = () : AxiosInstance => {
    if (!instance) {
        instance = axios.create({
            baseURL: `https://${SERVER_IP}:${SERVER_PORT}/api`
        });
    }
    return instance;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAxiosError = (error: AxiosError<any, any>) : RequestStatus => {
    if (error.response?.data.message) {
        return { success: false, message: error.response.data.message };
    }
    if (error.code === "ERR_NETWORK") {
        return { success: false, message: errorMessages.NET_ERROR };
    }
    return { success: false, message: errorMessages.AXIOS_UNKNOWN };
} 

export default axiosInstance;
