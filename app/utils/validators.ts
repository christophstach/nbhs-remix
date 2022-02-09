import { z } from "zod";
import { db } from "./db.server";
import { User } from "@prisma/client";


interface ValidationResult<T> {
    success: boolean;
    values: T;
    fieldErrors?: {
        [key: string]: string[];
    }
}

export async function validateCreateUser(formData: FormData): Promise<ValidationResult<User>> {
    const values = Object.fromEntries(formData) as unknown as User;

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

    const parsingResult = await schema.safeParseAsync(values);

    if (!parsingResult.success) {
        return {
            values,
            success: false,
            fieldErrors: parsingResult.error.flatten().fieldErrors
        };
    }

    return {
        values,
        success: true,
    };
}

export async function validateUpdateUser(userId: string, formData: FormData): Promise<ValidationResult<User>> {
    const values = Object.fromEntries(formData) as unknown as User;

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

    const parsingResult = await schema.safeParseAsync(values);

    if (!parsingResult.success) {
        return {
            values,
            success: false,
            fieldErrors: parsingResult.error.flatten().fieldErrors
        };
    }

    return {
        values,
        success: false
    };
}


