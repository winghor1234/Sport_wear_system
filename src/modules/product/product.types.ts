export interface CreateProductInput {
    product_name: string
    price: number
    stock_qty: number
    description?: string
    category_id: string
}

export interface UpdateProductInput {
    product_name?: string
    price?: number
    stock_qty?: number
    description?: string
    category_id?: string
}