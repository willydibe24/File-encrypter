import { z } from "zod"

export type AESFileEncryptionResult = {
    iv: ArrayBuffer,
    encryptedFileBuffer: ArrayBuffer,
    symmetricKey: ArrayBuffer,
}

export const JSONFileContentSchema = z.object({
    iv: z.string(),
    UUID: z.string(),
    extension: z.string(),
    mimeType: z.string(),
    encryptedFileBuffer: z.string(),
});

export type JSONFileContent = z.infer<typeof JSONFileContentSchema>;

export type RequestStatus = {
    success: boolean,
    message: string,
    symmetricKey?: string
}

export type RSAKeyPair = {
    publicKey: ArrayBuffer,
    privateKey: ArrayBuffer,
}

export type ToastType = "SUCCESS" | "ERROR" | "INFO" | "WARNING" | "LOADING";

export const fileExtensionSchema = z.enum([
    "wav", "avi", "txt", "xlsx", "xlsm", "xlsb", "xls", "psd",
    "csv", "css", "docx", "doc", "docm", "mp3", "pptx", "ppt",
    "pptm", "jpg", "png", "mov", "rar", "zip", "pdf", "html"
  ]);
  
export type FileExtensionType = z.infer<typeof fileExtensionSchema>;