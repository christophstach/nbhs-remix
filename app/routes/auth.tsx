import { Outlet } from "remix";
import AuthLayout from "~/components/layouts/AuthLayout";

export default function AuthRoute() {
    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    )
}
