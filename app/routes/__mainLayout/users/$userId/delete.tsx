import { Alert, Snackbar } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import SnackbarPortal from "~/components/SnackbarPortal";

export default function Users$UserId$DeleteRoute() {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <SnackbarPortal>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} onClick={handleClick} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}>
                    <Alert severity="success" sx={{width: "100%"}}>
                        This is a success message!
                    </Alert>
                </Snackbar>
            </SnackbarPortal>
            Users$UserId$DeleteRoute
        </>
    );
}
