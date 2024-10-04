import { FileAuthenticationInfo } from "../types/types";
import db from "../mysql/mysql-connect";
import { QueryError, RowDataPacket } from "mysql2";


interface EncryptedSymmetricKeyResult extends RowDataPacket {
    files_symmetric_key: Buffer;
}

const getEncryptedSymmetricKey = (fileAuthenticationInfo: FileAuthenticationInfo) : Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            db.query(`SELECT files_symmetric_key FROM files WHERE files_uuid = ?`, [fileAuthenticationInfo.UUID], (err: QueryError | null, result: EncryptedSymmetricKeyResult[]) => {
                if (err) throw err;
                resolve(result[0].files_symmetric_key);
                return;
            });
        } catch (error) {
            reject(error);
        }
    })
}


export default getEncryptedSymmetricKey;