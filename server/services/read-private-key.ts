import fs from "fs";
import { pemToBuffer } from "../../shared/encrypt-decrypt-methods"

export type KeyFileName = "Private_RSA_key_for_file_symmetric_key" | "Private_RSA_file_password_key" | "Private_RSA_UUID_key";

const getPemBufferFromFile = (keyFileName: KeyFileName): ArrayBuffer => {
    return pemToBuffer(fs.readFileSync(`keys/${keyFileName}.pem`).toString());
}


export default getPemBufferFromFile;
