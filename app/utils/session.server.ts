import { createCookieSessionStorage, redirect } from "remix";

const sessionSecret = process.env.SESSION_SECRET;
const sessionCookieName = process.env.SESSION_COOKIE_NAME;

if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

if (!sessionCookieName) {
    throw new Error("SESSION_COOKIE_NAME must be set");
}

const storage = createCookieSessionStorage({
    cookie: {
        name: sessionCookieName,
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true
    }
});

function exclude<User, Key extends keyof User>(
    user: User,
    ...keys: Key[]
): Omit<User, Key> {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}


export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");

    if (!userId || typeof userId !== "string") {
        const searchParams = new URLSearchParams([
            ["redirectTo", redirectTo]
        ]);

        throw redirect(`/auth/sign-in?${searchParams}`);
    }

    return userId;
}


export async function signIn(
    userId: string,
    redirectTo: string
) {
    const session = await storage.getSession();
    session.set("userId", userId);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session)
        }
    });
}


export async function signOut(request: Request) {
    const session = await storage.getSession(request.headers.get("Cookie"));

    return redirect("/auth/sign-in", {
        headers: {
            "Set-Cookie": await storage.destroySession(session)
        }
    });
}
