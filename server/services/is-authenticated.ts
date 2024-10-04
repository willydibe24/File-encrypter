import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import db from "../mysql/mysql-connect";
import bcrypt from "bcrypt"

interface IsAuthenticatedResult extends RowDataPacket {
    files_password: string;
}

const isAuthenticated = async (UUID: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT files_password FROM files WHERE files_uuid = ?`, [UUID], async (err: QueryError | null, result: IsAuthenticatedResult[]) => {
            if (err) {
                throw err;
            }
            if (result.length === 0) {
                resolve(false);
                return;
            }
            resolve(await bcrypt.compare(password, result[0].files_password));
            return;
        });
    })
}


export default isAuthenticated;