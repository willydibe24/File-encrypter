import { Request, Response } from "express";
import db from "../mysql/mysql-connect";
import { ParamsSendFileInfo } from "../../shared/shared-types"
import { QueryError, QueryResult } from "mysql2";
import { base64ToUint8Array } from "../../shared/array-methods";
import { FileAuthenticationInfo } from "../types/types";
import getUUIDAndHashedPassword from "../services/get-uuid-and-hashed-password";


export const encrypt = async (req: Request, res: Response) => {
    const { encryptedUUID, uint8EncryptedSymmetricKeyString, encryptedFilePassword }: ParamsSendFileInfo = req.body;

    if (!encryptedUUID || !uint8EncryptedSymmetricKeyString || !encryptedFilePassword) {
        return res.status(400).json({
            message: "Richiesta non valida. Parametri mancanti."
        });
    }

    let fileAuthenticationInfo: FileAuthenticationInfo;
    
    try {
        fileAuthenticationInfo = await getUUIDAndHashedPassword(encryptedUUID, encryptedFilePassword, true);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e instanceof Error ? e.message : "Errore interno del server. Errore di decrittazione."
        });
    }

    const encryptedSymmetricKey: Uint8Array = base64ToUint8Array(uint8EncryptedSymmetricKeyString);

    const insertQuerySuccess: boolean = await new Promise((resolve, reject) => {
        const q: string = `INSERT INTO files (files_UUID, files_symmetric_key, files_password) VALUES (?, ?, ?)`;
        const values: (string | Buffer)[] = [fileAuthenticationInfo.UUID, Buffer.from(encryptedSymmetricKey), fileAuthenticationInfo.password];

        db.query (q, values, (err: QueryError | null, result: QueryResult) => {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    })

    return res.status(insertQuerySuccess ? 200 : 500).json({
        message: insertQuerySuccess 
            ? "Elaborazione dei dati riuscita."
            : "Errore interno del server. Errore SQL."
    });
}
