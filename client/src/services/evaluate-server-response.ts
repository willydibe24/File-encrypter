import { AxiosResponse } from "axios";
import { RequestStatus } from "../types/types";

const evaluateServerResponse = (response: AxiosResponse, successMessage: string, errorMessage: string) : RequestStatus => {
    return { 
        success: response.status === 200, 
        message: response.status === 200 ? successMessage : errorMessage 
    }
}

export default evaluateServerResponse;