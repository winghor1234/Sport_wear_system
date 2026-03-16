import { AuthUser } from "@/modules/auth/auth.type";

export function authorize(user: AuthUser, roles: string[]) {

    if (!roles.includes(user.role)) {
        throw new Error("Forbidden")
    }

}