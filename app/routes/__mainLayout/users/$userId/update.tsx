import {
    ActionFunction,
    Form,
    json,
    LoaderFunction,
    redirect,
    useActionData,
    useLoaderData,
    useTransition
} from "remix";
import { db, exclude } from "~/utils/db.server";
import { User } from "@prisma/client";
import Box from "@mui/material/Box";
import { Card, CardActions, CardContent, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { validateUpdateUser } from "~/utils/validators";

export interface ActionData {
    values?: User,
    fieldErrors?: { [key: string]: string[] };
    formErrors?: string[];
}

export const action: ActionFunction = async ({request, params}) => {
    const formData = await request.formData();
    const userId = params.userId;

    if (userId) {
        const validationResult = await validateUpdateUser(userId, formData);

        if (validationResult.success) {
            const email = formData.get("email") as string;
            const firstName = formData.get("firstName") as string;
            const lastName = formData.get("lastName") as string;

            await db.user.update({
                data: {
                    email,
                    firstName,
                    lastName
                },
                where: {
                    id: userId
                }
            });

            return redirect("/users");
        }

        return json({
            fieldErrors: validationResult.fieldErrors,
            values: validationResult.values
        } as ActionData, {status: 400});
    }

    return new Response("Not found", {status: 404});
}


export const loader: LoaderFunction = async ({request, params}) => {
    const userId = params.userId;

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    });

    if (user) {
        return exclude(user, "passwordHash");
    } else {
        return new Response("Not found", {status: 404});
    }

}

export default function UsersUpdateRoute() {
    const loaderData = useLoaderData<Omit<User, "passwordHash">>();
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
                            defaultValue={loaderData.email}
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
                            placeholder="First Name"
                            name="firstName"
                            variant="standard"
                            defaultValue={loaderData.firstName}
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
                            defaultValue={loaderData.lastName}
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
