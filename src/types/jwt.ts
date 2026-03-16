export interface JwtPayload {
    user_id: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export interface AuthUser {
    user_id: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
}