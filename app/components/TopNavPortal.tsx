import { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";


const TopNavPortal: FunctionComponent = ({children}) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, []);

    if (mounted) {
        const element = document.querySelector("#top-nav-portal");

        if (element) {
            return createPortal(children, element);
        }
    }

    return null;
}


export default TopNavPortal;
