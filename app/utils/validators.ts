import { User } from "@prisma/client";
import { z } from "zod";
import { db } from "./db.server";


export async function validateCreateUser(user: Partial<User>) {
    const schema = z.object({
        email: z
            .string()
            .nonempty({message: "E-Mail is required"})
            .email("Must be a valid E-Mail Address")
            .refine(async (value) => {
                const count = await db.user.count({
                    where: {
                        email: value
                    }
                });

                return count === 0;
            }, "E-Mail Address does already exist in system"),
        password: z
            .string()
            .nonempty({message: "Password is required"})
            .min(6, "Must have at least 6 characters")
    });

    const parsingResult = await schema.safeParseAsync(user);

    if (!parsingResult.success) {
        return parsingResult.error.flatten().fieldErrors;
    }

    return null;
}

export async function validateUpdateUser(userId: string, user: Partial<User>) {
    const schema = z.object({
        email: z
            .string()
            .nonempty({message: "E-Mail is required"})
            .email("Must be a valid E-Mail Address")
            .refine(async (value) => {
                const count = await db.user.count({
                    where: {
                        email: value,
                        NOT: {
                            id: userId
                        }
                    }
                });

                return count === 0;
            }, "E-Mail Address does already exist in system")
    });

    const parsingResult = await schema.safeParseAsync(user);

    if (!parsingResult.success) {
        return parsingResult.error.flatten().fieldErrors;
    }

    return null;
}


export function formDataToObject<T>(formData: FormData) {
    const obj: { [key: string]: any } = {};

    formData.forEach((value, key) => {
        if (value) {
            obj[key] = value;
        } else {
            obj[key] = '';
        }
    });

    return obj as T;
}
