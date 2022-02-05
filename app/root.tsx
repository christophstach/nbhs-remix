import { ReactNode, useContext, useEffect } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "remix";
import { withEmotionCache } from "@emotion/react";
import ServerStyleContext from "./mui/ServerStyleContext";
import ClientStyleContext from "./mui/ClientStyleContext";
import theme from "./mui/theme";


interface DocumentProps {
    children: ReactNode;
    title?: string;
}

const Document = withEmotionCache(
    ({children, title}: DocumentProps, emotionCache) => {
        const serverStyleData = useContext(ServerStyleContext);
        const clientStyleData = useContext(ClientStyleContext);

        useEffect(() => {
            emotionCache.sheet.container = document.head;

            const tags = emotionCache.sheet.tags;
            emotionCache.sheet.flush();
            tags.forEach((tag) => {
                (emotionCache.sheet as any)._insertTag(tag);
            });

            clientStyleData.reset();
        }, []);

        return (
            <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="theme-color" content={theme.palette.primary.main} />
                {title ? <title>{title}</title> : null}
                <Meta />
                <Links />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                {serverStyleData?.map(({key, ids, css}) => (
                    <style
                        key={key}
                        data-emotion={`${key} ${ids.join(" ")}`}
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{__html: css}}
                    />
                ))}
            </head>
            <body>
            {children}
            <ScrollRestoration />
            <Scripts />
            {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
            </html>
        );
    }
);

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
    return (
        <Document>
            <Outlet />
        </Document>
    );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({error}: { error: Error }) {
    console.error(error);

    return (
        <Document title="Error!">
            <div>
                <h1>There was an error</h1>
                <p>{error.message}</p>
                <hr />
                <p>
                    Hey, developer, you should replace this with what you want your
                    users to see.
                </p>
            </div>
        </Document>
    );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
    const caught = useCatch();

    let message;
    switch (caught.status) {
        case 401:
            message = (
                <p>
                    Oops! Looks like you tried to visit a page that you do not have access
                    to.
                </p>
            );
            break;
        case 404:
            message = (
                <p>
                    Oops! Looks like you tried to visit a page that does not exist. (BUG:
                    Click browser back button)
                </p>
            );
            break;

        default:
            throw new Error(caught.data || caught.statusText);
    }

    return (
        <Document title={`${caught.status} ${caught.statusText}`}>
            <h1>
                {caught.status}: {caught.statusText}
            </h1>
            {message}
        </Document>
    );
}
