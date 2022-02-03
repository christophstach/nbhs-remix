import Cookies from 'js-cookie';

const userToken = Cookies.get(process.env.NEXT_PUBLIC_USER_TOKEN_COOKIE_NAME as string);

let payload: { exp: number, userName: string, roles?: string[]; };

if (userToken) {
    const [headerEncoded, payloadEncoded, signature] = userToken.split('.');
    payload = atob(payloadEncoded) as any;
} else {
    payload = {} as any;
}


export function isAdmin() {
    return true;
    return !!payload.roles?.includes('ADMIN');
}

export function isProjectResponsible() {
    return true;
    return !!payload.roles?.includes('PROJECT_RESPONSIBLE');
}

export function isDepartmentResponsible() {
    return !!payload.roles?.includes('DEPARTMENT_RESPONSIBLE');
}

export function isPublicRelationResponsible() {
    return !!payload.roles?.includes('PUBLIC_RELATION_RESPONSIBLE');
}

export function isExecutiveBoard() {
    return !!payload.roles?.includes('EXECUTIVE_BOARD');
}
