import { Outlet } from "remix";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Copyright from "~/components/elements/Copyright";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function AuthLayoutHiddenRoute() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Container component="main" maxWidth="xs">
                <Outlet />
                <Copyright />
            </Container>
        </ThemeProvider>
    );
}
