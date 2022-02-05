import * as React from "react";
import { renderToString } from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";

import createEmotionCache from "./mui/createEmotionCache";
import theme from "./mui/theme";
import ServerStyleContext from "./mui/ServerStyleContext";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    const cache = createEmotionCache();
    const {extractCriticalToChunks} = createEmotionServer(cache);

    const MuiRemixServer = () => (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <RemixServer context={remixContext} url={request.url} />
            </ThemeProvider>
        </CacheProvider>
    );

    // Render the component to a string.
    const html = renderToString(
        <ServerStyleContext.Provider value={null}>
            <MuiRemixServer />
        </ServerStyleContext.Provider>
    );

    // Grab the CSS from emotion
    const emotionChunks = extractCriticalToChunks(html);

    // Re-render including the extracted css.
    const markup = renderToString(
        <ServerStyleContext.Provider value={emotionChunks.styles}>
            <MuiRemixServer />
        </ServerStyleContext.Provider>
    );

    responseHeaders.set("Content-Type", "text/html");

    return new Response(`<!DOCTYPE html>${markup}`, {
        status: responseStatusCode,
        headers: responseHeaders
    });
}
