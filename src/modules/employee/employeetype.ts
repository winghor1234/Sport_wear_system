export type CreateEmployeeInput = {
    employee_name: string
    email: string
    password: string
    phone: string
}
export type UpdateEmployeeInput = {
    employee_name?: string
    email?: string
    phone?: string
}
