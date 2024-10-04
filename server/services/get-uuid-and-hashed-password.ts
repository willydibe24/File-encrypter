import { convertBufferToCryptoPrivateKey, fromEncryptedRSABase64StringToUTF8 } from "../../shared/encrypt-decrypt-methods";
import { FileAuthenticationInfo } from "../types/types";
import getPemBufferFromFile from "./read-private-key";
import bcrypt from "bcrypt"

const getUUIDAndHashedPassword = async (encryptedUUID: string, encryptedFilePassword: string, hashPassword: boolean = false) : Promise<FileAuthenticationInfo> => {
    const password: string = await fromEncryptedRSABase64StringToUTF8(encryptedFilePassword, await convertBufferToCryptoPrivateKey(getPemBufferFromFile("Private_RSA_file_password_key")));    
    return {
        UUID: await fromEncryptedRSABase64StringToUTF8(encryptedUUID, await convertBufferToCryptoPrivateKey(getPemBufferFromFile("Private_RSA_UUID_key"))),
        password: hashPassword 
            ? bcrypt.hashSync(password, bcrypt.genSaltSync())
            : password
    }
}

export default getUUIDAndHashedPassword;