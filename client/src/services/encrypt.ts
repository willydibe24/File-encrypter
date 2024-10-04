import { AESFileEncryptionResult } from "../types/types";
import { getCryptoKeyFromSymmetricKey, generateSymmetricKey } from "./generate-symmetric-key";
import { convertBufferToCryptoPublicKey, pemToBuffer } from "../../../shared/encrypt-decrypt-methods"
import { errorMessages } from "../responses/responses";

const IVSize: number = 12;


export const encryptFileWithAES = async (file: File) : Promise<AESFileEncryptionResult> => {
    let fileBuffer: ArrayBuffer;
    try {
        fileBuffer = await file.arrayBuffer();
    } catch (error) {
        throw new Error(`${errorMessages.FILE_TOO_LARGE} (${(file.size / Math.pow(1024, 3)).toFixed(2)} GB)`);
    }
    const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(IVSize));
    const symmetricKey: Uint8Array = generateSymmetricKey();

    const encryptedFile: ArrayBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        await getCryptoKeyFromSymmetricKey(symmetricKey),
        fileBuffer
    );
    return { 
        iv: iv.buffer,
        symmetricKey: symmetricKey,
        encryptedFileBuffer: encryptedFile,
    };
}


export const encryptStringWithRSA = async (text: string, pem: string | ArrayBuffer) : Promise<ArrayBuffer> => {
    return await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        await convertBufferToCryptoPublicKey(typeof pem === "string" ? pemToBuffer(pem) : pem),
        new TextEncoder().encode(text)
    )
}

