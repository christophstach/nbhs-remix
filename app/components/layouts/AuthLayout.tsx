import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

import { FunctionComponent } from "react";
import Copyright from "../elements/Copyright";

const theme = createTheme();


const AuthLayout: FunctionComponent = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {children}
                <Copyright />
            </Container>
        </ThemeProvider>
    );
}

export default AuthLayout;

