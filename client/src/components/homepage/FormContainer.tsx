import { Button } from "@mui/material";
import FilePasswordInput from "./FilePassword";
import { useRef, useState } from "react";
import { fileExtensionSchema, FileExtensionType } from "../../types/types";


const FormContainer = ({ title, file, setFile, setFilePassword, handleSubmit, encryptForm, encryptActive }: { title: string, file: File | undefined, setFile: (file: File | undefined) => void, setFilePassword: (filePassword: string | undefined) => void, handleSubmit: (e: React.FormEvent<HTMLFormElement>, file: File) => void, encryptForm: boolean, encryptActive: boolean }) => {
    type DropAreaText = "Clicca oppure trascina qui il file" | "Rilascia qui";
    
    const fileInputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);
    const [dropAreaText, setDropAreaText] = useState<DropAreaText>("Clicca oppure trascina qui il file");

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, setFile: (file: File) => void) => {
        e.preventDefault();
        const droppedFile: File = e.dataTransfer.files[0];
        
        e.currentTarget.classList.remove("on-drag-over");
        setDropAreaText("Clicca oppure trascina qui il file");
        
        if (droppedFile) {
            setFile(droppedFile);
        }
    }

    const getFileExtensionImage = (fileName: string | undefined) : string => {
        const path = "./file-images/";
        const fileExtension: string | undefined = fileName?.split('.').pop();

        if (!fileName || !fileExtension || !fileExtensionSchema.safeParse(fileExtension).success) return `${path}default-file.svg`
        
        const imageName  = (() => {
            switch (fileExtension as FileExtensionType) {
                case "doc": case "docm": case "docx":
                    return "word";
                case "ppt": case "pptm": case "pptx":
                    return "powerpoint";
                case "xls": case "xlsb": case "xlsm": case "xlsx":
                    return "excel";
                default:
                    return fileExtension;
            }
        })();
        return `${path}${imageName}-file.svg`;
    }

    return (
        <div id={`${encryptForm ? "encrypt" : "decrypt"}-container`} className={`form-container ${encryptActive ? "active" : "inactive"}`}>
            <h1 className="form-title">{title}</h1>
            <form className="form" method="post" onSubmit={e => handleSubmit(e, file!)}>
                <div className="file-input-container">
                    <input
                        type="file"
                        id={`file-${encryptForm ? "encrypt" : "decrypt"}`}
                        onChange={(e) => {
                            setFile(e.target.files?.[0]);
                        }}
                        ref={fileInputRef}
                        hidden
                    />
                    <div 
                        className="file-drop-box"
                        onDrop={(e: React.DragEvent<HTMLDivElement>) => handleFileDrop(e, setFile)}
                        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                            e.preventDefault();
                            e.currentTarget.classList.add("on-drag-over");
                            setDropAreaText("Rilascia qui");
                        }}
                        onClick={() => {fileInputRef.current?.click()}}
                    >
                        <div className="file-drop-box-image">
                            <img id="file-image" src={getFileExtensionImage(file?.name)} alt="" />
                            <p>{file ? file.name : dropAreaText}</p>
                        </div>
                    </div>
                </div>
                <div className="form-bottom-container">
                    <FilePasswordInput 
                        id={`file-${encryptForm ? "encrypt" : "decrypt"}-password`}
                        onChange={(e) => {
                            setFilePassword(e.target.value);
                        }}
                    />
                    <div className="form-actions-buttons">
                        <Button
                            type="reset"
                            variant="contained"
                            id={`reset-${encryptForm ? "encrypt" : "decrypt"}`}
                            onClick={() => {
                                setFile(undefined);
                                setFilePassword(undefined);
                            }}
                        >Reset</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            id={`submit-${encryptForm ? "encrypt" : "decrypt"}`}
                            color="success"
                        >Invio</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default FormContainer;
