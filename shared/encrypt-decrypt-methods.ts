import { base64ToUint8Array } from "./array-methods";


export const pemToBuffer = (pem: string) => {
    const binary = atob(pem.replace(/-----BEGIN [A-Z ]+-----|-----END [A-Z ]+-----|\s+/g, ''));
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i);
    }
    return buffer;
};


export const convertBufferToCryptoPrivateKey = async (privateKeyBuffer: ArrayBuffer) : Promise<CryptoKey> => {
    try {
        return await crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            false,
            ["decrypt"]
        );
    } catch (e) {
        console.error("Key import error:", e);
        throw e;
    }
}


export const convertBufferToCryptoPublicKey = async (publicKeyBuffer: ArrayBuffer, exportKey: boolean = false) : Promise<CryptoKey> => {
    return await crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        exportKey,
        ["encrypt"]
    );
}


export const encryptArrayBufferWithRSA = async (arr: ArrayBuffer, pem: string | ArrayBuffer) : Promise<ArrayBuffer> => {
    return await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        await convertBufferToCryptoPublicKey(typeof pem === "string" ? pemToBuffer(pem) : pem),
        arr
    );
}


export const fromEncryptedRSABase64StringToUTF8 = async (text: string, privateKey: CryptoKey) : Promise<string> => {
    try {
        return new TextDecoder().decode(await fromEncryptedRSABase64StringToArrayBuffer(text, privateKey));
    } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error("Errore durante la decodificazione della stringa.");
    }
}


export const fromEncryptedRSABase64StringToArrayBuffer = async (text: string, privateKey: CryptoKey) : Promise<ArrayBuffer> => {
    try {
        return await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            base64ToUint8Array(text).buffer
        );
    } catch (e) {
        throw new Error("Errore durante la decrittazione della stringa.");
    }
}
