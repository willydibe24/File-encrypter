import { ToastContainer } from "react-toastify";
import Homepage from "./components/homepage/Homepage";
import "./index.css"


const App = () => {
    return (
        <>
            <Homepage />
            <ToastContainer 
                style={{top: "85px"}}
                theme="dark"
            />
        </>
    );
}


export default App;