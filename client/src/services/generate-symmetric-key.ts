const symmetricKeySize: number = 16;

export const generateSymmetricKey = () : Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(symmetricKeySize))
}


export const getCryptoKeyFromSymmetricKey = async (symmetricKey: ArrayBuffer) : Promise<CryptoKey> => {
    return await crypto.subtle.importKey(
        "raw",
        symmetricKey,
        { 
            name: "AES-GCM"
        },
        true,
        ["encrypt", "decrypt"]
    );
}
