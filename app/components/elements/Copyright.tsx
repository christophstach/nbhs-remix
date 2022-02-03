import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";
import { FunctionComponent } from "react";

const Copyright: FunctionComponent = () => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" mt={5}>
            {"Copyright © "}
            <Link color="inherit" href="https://www.nbhs.de/">
                NBHS
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default Copyright;
