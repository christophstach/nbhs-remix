import * as bcrypt from "bcryptjs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Alert, TextField } from "@mui/material";
import { ActionFunction, Form, MetaFunction, useActionData, useTransition } from "remix";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { db } from "~/utils/db.server";
import { signIn } from "~/utils/session.server";

export const meta: MetaFunction = () => {
    return {
        title: "NBHS: Einloggen"
    };
};

interface ActionData {
    errors: string[];
}

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
        const user = await db.user.findUnique({
            where: {
                email
            }
        });

        if (user && user.passwordHash) {
            if (await bcrypt.compare(password, user.passwordHash)) {
                return signIn(user.id, "/");
            }
        }
    }

    return {
        errors: [
            "Wrong credentials"
        ]
    } as ActionData;
};

export default function AuthSignInRoute() {
    const actionData = useActionData<ActionData>();
    const {state} = useTransition();
    const busy = state === "submitting" || state === "loading";

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
                    <img
                        className="AuthSignInRoute__nbhs_logo"
                        src="/nbhs_nachbarschaftheim_logo.svg"
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
