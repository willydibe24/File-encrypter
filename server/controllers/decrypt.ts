import { Request, Response } from "express"
import { ParamsGetFileSymmetricKey } from "../../shared/shared-types"
import { FileAuthenticationInfo } from "../types/types";
import getUUIDAndPassword from "../services/get-uuid-and-hashed-password";
import isAuthenticated from "../services/is-authenticated";
import getEncryptedSymmetricKey from "../services/get-encrypted-symetric-key";
import getPemBufferFromFile from "../services/read-private-key";
import { arrayBufferToBase64, base64ToUint8Array } from "../../shared/array-methods";
import { convertBufferToCryptoPrivateKey, encryptArrayBufferWithRSA } from "../../shared/encrypt-decrypt-methods";


export const decrypt = async (req: Request, res: Response) => {
    const { encryptedUUID, encryptedFilePassword, publicKeyToEncryptSymmetricKey }: ParamsGetFileSymmetricKey = req.body;

    if (!encryptedUUID || !encryptedFilePassword || !publicKeyToEncryptSymmetricKey) {
        return res.status(400).json({
            message: "Richiesta non valida. Parametri mancanti."
        });
    }

    let fileAuthenticationInfo: FileAuthenticationInfo;
    
    try {
        fileAuthenticationInfo = await getUUIDAndPassword(encryptedUUID, encryptedFilePassword);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e instanceof Error ? e.message : "Errore interno del server. Errore di decrittazione."
        });
    }

    let encryptedSymmetricKey: Buffer;

    try {
        if (!await isAuthenticated(fileAuthenticationInfo.UUID, fileAuthenticationInfo.password)) {
            return res.status(401).json({
                message: "Password del file errata."
            });
        }
        encryptedSymmetricKey = await getEncryptedSymmetricKey(fileAuthenticationInfo);
    } catch (error) {
        return res.status(500).json({
            message: "Errore interno del server. Errore SQL."
        });
    }

    let decryptedSymmetricKey: ArrayBuffer;

    try {
        decryptedSymmetricKey = await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            await convertBufferToCryptoPrivateKey(getPemBufferFromFile("Private_RSA_key_for_file_symmetric_key")),
            encryptedSymmetricKey
        );
    } catch (error) {
        return res.status(500).json({
            message: "Errore interno del server. Errore di decrittazione."
        });
    }
    
    const publicKey: ArrayBuffer = base64ToUint8Array(publicKeyToEncryptSymmetricKey).buffer;

    return res.status(200).json({
        message: "Elaborazione dei dati riuscita.",
        symmetricKey: arrayBufferToBase64(await encryptArrayBufferWithRSA(decryptedSymmetricKey, publicKey))
    });
}