import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const FilePasswordInput = ({ id, onChange }: { id: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    return (
        <>
            <div className="file-password-container">
                <input 
                    type={isVisible ? "text" : "password"} 
                    id={id}
                    className="file-password-input"
                    onChange={onChange}
                    placeholder="Inserisci la password del file"
                />
                <input 
                    type="button" 
                    id={`toggle-visibility-${id}`} 
                    className="file-password-input-toggle-button"
                    onClick={() => setIsVisible(!isVisible)}
                    value={"Mostra password"}
                />
                <label htmlFor={`toggle-visibility-${id}`}>
                    <FontAwesomeIcon 
                        className={`file-password-input-eye ${isVisible ? "active" : "inactive"}`}
                        icon={isVisible ? faEyeSlash : faEye} 
                    />
                </label>
            </div>
        </>
    );
}


export default FilePasswordInput;