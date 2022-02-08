import { ActionFunction, Form, json, redirect, useActionData, useTransition } from "remix";
import { db } from "~/utils/db.server";
import * as bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { formDataToObject, validateCreateUser } from "~/utils/validators";
import { Card, CardActions, CardContent, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";


export interface ActionData {
    values?: User,
    fieldErrors?: { [key: string]: string[] };
    formErrors?: string[];
}


export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const user = formDataToObject<User>(formData);
    const fieldErrors = await validateCreateUser(user);

    if (!fieldErrors) {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10));

        const user = await db.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName
            }
        });

        return redirect(`/users/${user.id}`);
    }

    return json({fieldErrors, values: user} as ActionData, {status: 400});
}


export default function UsersCreateRoute() {
    const actionData = useActionData<ActionData>();
    const {state} = useTransition();

    return (
        <Box sx={{flex: 1}}>
            <Form method="post">
                <Card>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                        <TextField
                            placeholder="E-Mail"
                            name="email"
                            type="email"
                            autoComplete="off"
                            variant="standard"
                            autoFocus
                            error={!!actionData?.fieldErrors?.email}
                            helperText={
                                actionData?.fieldErrors?.email ? (
                                    <>
                                        {
                                            actionData
                                                .fieldErrors
                                                .email
                                                .map((error, index) => <span
                                                    key={index}>&bull; {error}<br /></span>)
                                        }
                                    </>
                                ) : null
                            }
                        />

                        <TextField
                            placeholder="Password"
                            type="password"
                            autoComplete="new-password"
                            name="password"
                            variant="standard"
                            error={!!actionData?.fieldErrors?.password}
                            helperText={
                                actionData?.fieldErrors?.password ? (
                                    <>
                                        {
                                            actionData
                                                .fieldErrors
                                                .password
                                                .map((error, index) => <span
                                                    key={index}>&bull; {error}<br /></span>)
                                        }
                                    </>
                                ) : null
                            }
                        />

                        <TextField
                            placeholder="First Name"
                            name="firstName"
                            variant="standard"
                            error={!!actionData?.fieldErrors?.firstName}
                            helperText={
                                actionData?.fieldErrors?.firstName ? (
                                    <>
                                        {
                                            actionData
                                                .fieldErrors
                                                .firstName
                                                .map((error, index) => <span
                                                    key={index}>&bull; {error}<br /></span>)
                                        }
                                    </>
                                ) : null
                            }
                        />

                        <TextField
                            placeholder="Last Name"
                            name="lastName"
                            variant="standard"
                            error={!!actionData?.fieldErrors?.lastName}
                            helperText={
                                actionData?.fieldErrors?.lastName ? (
                                    <>
                                        {
                                            actionData
                                                .fieldErrors
                                                .lastName
                                                .map((error, index) => <span
                                                    key={index}>&bull; {error}<br /></span>)
                                        }
                                    </>
                                ) : null
                            }
                        />
                    </CardContent>

                    <CardActions>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="secondary"
                            startIcon={<SaveIcon />}
                            loadingPosition="start"
                            loading={state === "submitting" || state === "loading"}
                            disabled={state === "submitting" || state === "loading"}>Save</LoadingButton>
                    </CardActions>
                </Card>
            </Form>
        </Box>
    )
}
