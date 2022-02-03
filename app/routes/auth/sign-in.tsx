import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Alert, TextField } from "@mui/material";
import { ActionFunction, Form, redirect, useActionData, useTransition } from "remix";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";


interface ActionData {
    errors: string[];
}

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");


    if (email === "admin@nbhs.de" && password === "123") {
        return redirect("/");
    } else {
        const response = {
            errors: [
                "Wrong credentials"
            ]
        } as ActionData;

        return new Promise(resolve => {
            setTimeout(() => resolve(response), 3000);
        });
    }
};

export default function AuthSignInRoute() {
    const actionData = useActionData<ActionData>();
    const {state} = useTransition();
    const busy = state === "submitting";

    return (
        <Form method="post">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box mb={5}>
                    <img className="AuthSignInRoute__nbhs_logo" src="/nbhs_nachbarschaftheim_logo.svg"
                         alt="NBHS Logo" />
                </Box>

                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box sx={{mt: 1}}>
                    <TextField

                        autoFocus
                        required
                        fullWidth
                        margin="normal"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                    />
                    <LoadingButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={busy}
                        loading={busy}
                        loadingPosition="start"
                        startIcon={<SendIcon />}
                    >
                        Sign In
                    </LoadingButton>

                    {
                        actionData?.errors ? actionData.errors.map(error => (
                            <Alert severity="error">{error}</Alert>
                        )) : <></>
                    }
                </Box>
            </Box>
        </Form>
    );
}
