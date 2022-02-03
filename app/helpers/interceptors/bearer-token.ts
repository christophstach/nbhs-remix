import Cookies from 'js-cookie';

export function bearerTokenInterceptor(config: any) {
    const userToken = Cookies.get(process.env.NEXT_PUBLIC_USER_TOKEN_COOKIE_NAME as string);
    const signedIn = !!userToken;


    if (signedIn) {
        config.headers.common['Authorization'] = `Bearer ${userToken}`;
    }

    return config;
}
