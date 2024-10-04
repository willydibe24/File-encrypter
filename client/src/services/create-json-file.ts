import { JSONFileContent } from "../types/types";

const createJsonFile = (content: JSONFileContent) : Blob => {
    return new Blob([JSON.stringify(content)], { type: "application/json" })
}

export default createJsonFile;