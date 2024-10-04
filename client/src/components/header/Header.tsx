import { SERVER_IP, SERVER_PORT } from "../../axios/axios-config";
import "./header.css"

type SelectButtonProps = {
    text?: "Encripta" | "Decripta";
    encryptActive: boolean;
    setEncryptActive: (active: (prevState: boolean) => boolean) => void;
}
  

const Header: React.FC<SelectButtonProps> = ({ encryptActive, setEncryptActive }) => {
    return (
        <>
            <header>
                <a href={`https://${SERVER_IP}:${SERVER_PORT}`} className="header-lock-href" target="_blank">
                    <img src="lock.png" alt="" className="header-lock" />
                </a>
                <nav className="buttons-container">
                    <SelectButton 
                        text="Encripta"
                        encryptActive={encryptActive}
                        setEncryptActive={setEncryptActive}
                    />
                    <SelectButton 
                        text="Decripta"
                        encryptActive={encryptActive}
                        setEncryptActive={setEncryptActive}
                    />
                </nav>
            </header>
        </>
    )
}


const SelectButton: React.FC<SelectButtonProps> = ({ text, encryptActive, setEncryptActive }) => {
    return (
        <button 
            className={`header-btn ${encryptActive === (text === "Encripta") ? "active" : "inactive"}`}
            onClick={() => {
                setEncryptActive(() => { return text === "Encripta" });
            }}
        >{text}
        </button>
    )
}


export default Header;