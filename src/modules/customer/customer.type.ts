export type CreateCustomerInput = {
    customer_name: string
    email: string
    password: string
    phone: string
}
export type UpdateCustomerInput = {
    customer_name?: string
    email?: string
    phone?: string
}
