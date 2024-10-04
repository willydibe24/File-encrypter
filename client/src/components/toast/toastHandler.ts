import { Id, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastType } from "../../types/types";


const showToast = (toastType: ToastType, message: string) : Id => {
    const toastMap = {
        "SUCCESS": toast.success,
        "ERROR": toast.error,
        "INFO": toast.info,
        "WARNING": toast.warning,
        "LOADING": toast.loading,
    };
    return toastMap[toastType](message, {autoClose: message.length > 3 ? message.length * 100 : 3000});
}

export const dismissToast = (id: Id) : void => {
    toast.dismiss(id);
}


export default showToast;