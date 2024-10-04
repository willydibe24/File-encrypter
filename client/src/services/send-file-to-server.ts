import { AxiosResponse, isAxiosError } from "axios";
import { RequestStatus } from "../types/types";
import axiosInstance, { handleAxiosError } from "../axios/axios-config";
import { successMessages, errorMessages } from "../responses/responses";
import { ParamsSendFileInfo } from "../../../shared/shared-types"
import { encryptStringWithRSA } from "./encrypt";
import { filePasswordPublicKeyPEM, keyForFileSymmetricKeyPEM, UUIDPublicKeyPEM } from "../keys/keys";
import { arrayBufferToBase64 } from "../../../shared/array-methods";
import evaluateServerResponse from "./evaluate-server-response";
import { encryptArrayBufferWithRSA } from "../../../shared/encrypt-decrypt-methods";


const sendFileToServer = async (symmetricKey: ArrayBuffer, filePassword: string, UUID: string) : Promise<RequestStatus> => {
    let params: ParamsSendFileInfo;
    try {
        params = {
            encryptedUUID: arrayBufferToBase64(await encryptStringWithRSA(UUID, UUIDPublicKeyPEM)),
            uint8EncryptedSymmetricKeyString: arrayBufferToBase64(await encryptArrayBufferWithRSA(symmetricKey, keyForFileSymmetricKeyPEM)),
            encryptedFilePassword: arrayBufferToBase64(await encryptStringWithRSA(filePassword, filePasswordPublicKeyPEM)),
        }
    } catch (error) {
        return { success: false, message: errorMessages.FAILED_TO_ENCRYPT_DATA_TO_SEND }
    }

    try {
        const res: AxiosResponse = await axiosInstance().post("/encrypt", params, {
            headers: { "Content-Type": "application/json" },
        });
        return evaluateServerResponse(res, successMessages.ENCRYPT_SUCCESS, errorMessages.ENCRYPT_DECRYPT_FAILED_SERVER_ERROR);
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return handleAxiosError(error);
        } 
        return { success: false, message: errorMessages.ENCRYPT_DECRYPT_FAILED_SERVER_ERROR }
    }
}


export default sendFileToServer;