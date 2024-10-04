import { AxiosResponse, isAxiosError } from "axios"
import { arrayBufferToBase64 } from "../../../shared/array-methods"
import { ParamsGetFileSymmetricKey } from "../../../shared/shared-types"
import { filePasswordPublicKeyPEM, UUIDPublicKeyPEM } from "../keys/keys"
import { encryptStringWithRSA } from "./encrypt"
import { errorMessages, successMessages } from "../responses/responses"
import axiosInstance, { handleAxiosError } from "../axios/axios-config"
import { RequestStatus } from "../types/types"
import evaluateServerResponse from "./evaluate-server-response"

const getSymmetricKeyFromServer = async (UUID: string, filePassword: string, publicKey: ArrayBuffer) : Promise<RequestStatus> => {
    let params: ParamsGetFileSymmetricKey;

    try {        
        params = {
            encryptedUUID: arrayBufferToBase64(await encryptStringWithRSA(UUID, UUIDPublicKeyPEM)),
            encryptedFilePassword: arrayBufferToBase64(await encryptStringWithRSA(filePassword, filePasswordPublicKeyPEM)),
            publicKeyToEncryptSymmetricKey: arrayBufferToBase64(publicKey),
        }
    } catch (error) {
        return { success: false, message: errorMessages.FAILED_TO_ENCRYPT_DATA_TO_SEND }
    }

    try {
        const res: AxiosResponse = await axiosInstance().post("/decrypt", params, {
            headers: { "Content-Type": "application/json" },
        });
        
        return { 
            ...evaluateServerResponse(res, successMessages.DECRYPT_SUCCESS, errorMessages.ENCRYPT_DECRYPT_FAILED_SERVER_ERROR),
            symmetricKey: res.data.symmetricKey
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return handleAxiosError(error);
        }
        return { success: false, message: errorMessages.ENCRYPT_DECRYPT_FAILED_SERVER_ERROR }
    }
}


export default getSymmetricKeyFromServer;