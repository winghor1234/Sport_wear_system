export interface LoginInput {
    email: string
    password: string
}

export interface CustomerRegisterInput {
    customer_name: string
    email: string
    password: string
    phone: string
}


export interface EmployeeRegisterInput {
    employee_name: string
    email: string
    password: string
    phone: string
}

export interface AuthUser {
    user_id: string
    role: "ADMIN" | "STAFF" | "CUSTOMER"
}

export interface JwtPayload {
    user_id: string
    role: string
}





