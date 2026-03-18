export type CreateSupplierInput = {
    supplier_name: string
    phone: string
    address?: string
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>