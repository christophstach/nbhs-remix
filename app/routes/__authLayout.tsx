import { Outlet } from "remix";
import Container from "@mui/material/Container";
import Copyright from "~/components/Copyright";


export default function AuthLayoutHiddenRoute() {
    return (
        <Container component="main" maxWidth="xs">
            <Outlet />
            <Copyright />
        </Container>
    );
}
