import { AESFileEncryptionResult, JSONFileContent, RequestStatus } from "../types/types";
import { errorMessages } from "../responses/responses";
import { arrayBufferToBase64 } from "../../../shared/array-methods";
import createJsonFile from "./create-json-file";
import { encryptFileWithAES } from "./encrypt";
import sendFileToServer from "./send-file-to-server";
import triggerDownload from "./trigger-download";

const UUIDSize: number = 16;


const handleEncrypt = async (file: File, filePassword: string): Promise<RequestStatus> => {
    const aesfileContent: AESFileEncryptionResult = await encryptFileWithAES(file);
    const UUID: string = crypto.randomUUID().substring(0, UUIDSize);
    const requestStatus: RequestStatus = await sendFileToServer(aesfileContent.symmetricKey, filePassword, UUID);

    if (requestStatus.success) {
        const content: JSONFileContent = {
            iv: arrayBufferToBase64(aesfileContent.iv),
            UUID: UUID,
            extension: file.name.match(/\..*$/)?.[0] || "",
            mimeType: file.type,
            encryptedFileBuffer: arrayBufferToBase64(aesfileContent.encryptedFileBuffer),
        }
        try {
            triggerDownload(createJsonFile(content), ".json");
        } catch (error) {
            return { success: false, message: errorMessages.CREATE_JSON_ERROR }
        }
    }
    return requestStatus;
}


export default handleEncrypt;