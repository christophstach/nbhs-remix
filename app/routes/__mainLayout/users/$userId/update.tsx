import { ActionFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { User } from "@prisma/client";

interface ActionData {
    values?: {
        user: User
    },
    errors?: string[];
}

export const action: ActionFunction = async ({request, params}) => {
    const formData = await request.formData();
    const userId = params.userId;

    console.log(userId);

    if (userId) {
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

    return {
        errors: []
    } as ActionData;
}
