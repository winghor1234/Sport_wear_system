import { Prisma } from "@prisma/client"


export interface CustomerLoginInput {
    email: string
    password: string
}

export interface EmployeeLoginInput {
    email: string
    password: string
}

export interface RegisterInput {
    customer_name: string
    email: string
    password: string
    phone: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface AuthUser {
    user_id: string
    role: "ADMIN" | "STAFF" | "CUSTOMER"
}

export interface JwtPayload {
    user_id: string
    role: string
}





