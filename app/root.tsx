import type { LinksFunction, MetaFunction } from "remix";
import { Links, LiveReload, Outlet, Scripts, ScrollRestoration } from "remix";
import globalStylesUrl from "./styles/global.css";

export const links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            href: globalStylesUrl
        }
    ];
}


export const meta: MetaFunction = () => {
    return {
        title: "NBHS"
    };
};

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />

            <Links />
        </head>
        <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" ? (
            <LiveReload />
        ) : null}
        </body>
        </html>
    );
}
