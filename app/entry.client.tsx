import { ReactNode, useState } from "react";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";

import ClientStyleContext from "./mui/ClientStyleContext";
import theme from "./mui/theme";
import createEmotionCache from "~/mui/createEmotionCache";


interface ClientCacheProviderProps {
    children: ReactNode;
}

function ClientCacheProvider({children}: ClientCacheProviderProps) {
    const [cache, setCache] = useState(createEmotionCache());

    function reset() {
        setCache(createEmotionCache());
    }

    return (
        <ClientStyleContext.Provider value={{reset}}>
            <CacheProvider value={cache}>{children}</CacheProvider>
        </ClientStyleContext.Provider>
    );
}

hydrate(
    <ClientCacheProvider>
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <RemixBrowser />
        </ThemeProvider>
    </ClientCacheProvider>,
    document
);
