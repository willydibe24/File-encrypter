import { convertBufferToCryptoPrivateKey, fromEncryptedRSABase64StringToArrayBuffer } from "../../../shared/encrypt-decrypt-methods";
import { JSONFileContent, JSONFileContentSchema, RequestStatus, RSAKeyPair } from "../types/types";
import { errorMessages, successMessages } from "../responses/responses";
import { decryptFileWithAES } from "./decrypt";
import generateRSAKeyPair from "./generate-RSA-key-pair";
import getSymmetricKeyFromServer from "./get-symmetric-key-from-server";
import triggerDownload from "./trigger-download";


const handleDecrypt = async (file: File, filePassword: string) : Promise<RequestStatus> => {
    let fileParsedJson: JSONFileContent;

    try {
        fileParsedJson = JSONFileContentSchema.parse(JSON.parse(await file.text()));
    } catch (error) {
        throw new Error(errorMessages.FAILED_TO_PARSE_JSON);
    }

    const rsaKeyPair: RSAKeyPair = await generateRSAKeyPair();
    const requestStatus: RequestStatus = await getSymmetricKeyFromServer(fileParsedJson.UUID, filePassword, rsaKeyPair.publicKey);

    if (requestStatus.success && requestStatus.symmetricKey) {
        const symmetricKey: ArrayBuffer = await fromEncryptedRSABase64StringToArrayBuffer(requestStatus.symmetricKey, await convertBufferToCryptoPrivateKey(rsaKeyPair.privateKey))

        try {
            const decrypted: Blob = await decryptFileWithAES(fileParsedJson.encryptedFileBuffer, fileParsedJson.mimeType, fileParsedJson.iv, symmetricKey);
            triggerDownload(decrypted, fileParsedJson.extension);
            return { success: true, message: successMessages.DECRYPT_SUCCESS }
        } catch (error) {
            return { success: false, message: errorMessages.FAILED_TO_DECRYPT_FILE_BUFFER }
        }        
    }
    return requestStatus;
}

export default handleDecrypt;