export type ParamsSendFileInfo = {
    encryptedUUID: string,
    uint8EncryptedSymmetricKeyString: string,
    encryptedFilePassword: string,
}

export type ParamsGetFileSymmetricKey = {
    encryptedUUID: string,
    encryptedFilePassword: string,
    publicKeyToEncryptSymmetricKey: string,
}
