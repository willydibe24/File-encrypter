import { errorMessages } from "../responses/responses";
import { base64ToUint8Array } from "../../../shared/array-methods";
import { getCryptoKeyFromSymmetricKey } from "./generate-symmetric-key";


export const decryptFileWithAES = async (encryptedBuffer: string, mimeType: string, iv: string, symmetricKey: ArrayBuffer) : Promise<Blob> => {
    try {
        const decryptedFileBuffer: ArrayBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: base64ToUint8Array(iv).buffer
            },
            await getCryptoKeyFromSymmetricKey(symmetricKey),
            base64ToUint8Array(encryptedBuffer).buffer
        );    
        return new Blob([decryptedFileBuffer], { type: mimeType.length > 0 ? mimeType : "application/octet-stream" });
    } catch (error) {
        throw new Error(errorMessages.FAILED_TO_DECRYPT_FILE_BUFFER);
    }
}