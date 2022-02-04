import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ActionFunction, Form, MetaFunction } from "remix";
import { createRef, useEffect } from "react";
import { signOut } from "~/utils/session.server";

export const meta: MetaFunction = () => {
    return {
        title: "NBHS: Ausloggen"
    };
};

export const action: ActionFunction = async ({request}) => {
    return signOut(request);
}


export default function AuthSignOutRoute() {
    const form = createRef<HTMLFormElement>()

    useEffect(() => {
        setTimeout(() => {
            form.current?.submit();
        }, 2000);
    });

    return (
        <Form method="post" ref={form}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box mb={5}>
                    <img
                        className="AuthSignOutRoute__nbhs_logo"
                        src="/nbhs_nachbarschaftheim_logo.svg"
                        alt="NBHS Logo" />
                </Box>

                <Typography component="h1" variant="h5">
                    Sie wurden ausgeloggt!
                </Typography>
            </Box>
        </Form>

    );
}
