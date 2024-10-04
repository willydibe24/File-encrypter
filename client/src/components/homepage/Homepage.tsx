import { useState } from "react";
import handleDecrypt from "../../services/decryption-handler";
import handleEncrypt from "../../services/encryption-handler";
import { errorMessages, successMessages } from "../../responses/responses";
import showToast, { dismissToast } from "../toast/toastHandler";
import FormContainer from "./FormContainer";
import "./homepage.css"
import { RequestStatus } from "../../types/types";
import { Id } from "react-toastify";
import Header from "../header/Header";

const Homepage = () => {
    const [fileToEncrypt, setFileToEncrypt] = useState<File | undefined>();
    const [fileToDecrypt, setFileToDecrypt] = useState<File | undefined>();
    const [fileToEncryptPw, setFileToEncryptPw] = useState<string>();
    const [fileToDecryptPw, setFileToDecryptPw] = useState<string>();
    const [encryptActive, setEncryptActive] = useState<boolean>(true);


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, file: File | undefined, filePassword: string | undefined, action: (file: File, filePassword: string) => Promise<RequestStatus>, isEncryptRequest: boolean) => {
        e.preventDefault();
        if (file === undefined) {
            showToast("INFO", isEncryptRequest ? errorMessages.NO_FILE_TO_ENCRYPT : errorMessages.NO_FILE_TO_DECRYPT);
            return;
        }
        
        if (filePassword === undefined || filePassword.length === 0) {
            showToast("INFO", isEncryptRequest ? errorMessages.NO_PASSWORD_FOR_ENCRYPT : errorMessages.NO_PASSWORD_FOR_DECRYPT);
            return;
        }

        const loadingToastId: Id = showToast("LOADING", successMessages.SENDING_FILE);
        
        try {
            const requestStatus: RequestStatus = await action(file, filePassword);
            showToast(requestStatus.success ? "SUCCESS" : "ERROR", requestStatus.message);
        } catch (error) {
            if (error instanceof Error) {
                showToast("ERROR", error.message);
                return;
            }
            showToast("ERROR", errorMessages.ERROR_WHILE_SENDING_REQUEST);
        } finally {
            dismissToast(loadingToastId);
        }
    }
    
    const handleSendEncrypt = (e: React.FormEvent<HTMLFormElement>, file: File | undefined) => {
        handleFormSubmit(e, file, fileToEncryptPw, handleEncrypt, true);
    }
    
    const handleSendDecrypt = (e: React.FormEvent<HTMLFormElement>, file: File | undefined) => {
        handleFormSubmit(e, file, fileToDecryptPw, handleDecrypt, false);
    }

    return (
        <>
            <Header 
                encryptActive={encryptActive}
                setEncryptActive={setEncryptActive} 
            />
            <div className="homepage">
                <FormContainer
                    title="Encripta"
                    file={fileToEncrypt}
                    setFile={setFileToEncrypt}
                    setFilePassword={setFileToEncryptPw}
                    handleSubmit={handleSendEncrypt}
                    encryptForm={true}
                    encryptActive={encryptActive}
                />
                <FormContainer
                    title="Decripta"
                    file={fileToDecrypt}
                    setFile={setFileToDecrypt}
                    setFilePassword={setFileToDecryptPw}
                    handleSubmit={handleSendDecrypt}
                    encryptForm={false}
                    encryptActive={!encryptActive}
                />
            </div>
        </>
    );
}

export default Homepage;
