export function baseUrlInterceptor(config: any) {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
        config.baseURL = process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_BASE_URL;
    } else {
        if (config.url.endsWith('.json')) {
            config.baseURL = process.env.NEXT_PUBLIC_DEVELOPMENT_FRONTEND_BASE_URL;
        } else {
            config.baseURL = process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_BASE_URL;
        }
    }

    return config;
}
