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
    const userId = params.userId;

    if (userId) {
        await db.user.delete({
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
