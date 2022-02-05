import { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";


const SnackbarPortal: FunctionComponent = ({children}) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, []);

    if (mounted) {
        const element = document.querySelector("#snackbar-portal");

        if (element) {
            return createPortal(children, element);
        }
    }

    return null;
}


export default SnackbarPortal;
