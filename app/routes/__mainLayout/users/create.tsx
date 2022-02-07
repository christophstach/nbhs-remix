import { ActionFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import * as bcrypt from "bcryptjs";
import { User } from "@prisma/client";


interface ActionData {
    values?: {
        user: User
    },
    errors?: string[];
}

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10));

        await db.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName
            }
        });

        return redirect("/users");
    }

    return {
        errors: []
    } as ActionData;
};
