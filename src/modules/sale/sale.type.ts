export type SaleItemInput = {
    product_id: string
    quantity: number
    price: number
}

export type CreateSaleInput = {
    customer_id?: string
    sale_details: SaleItemInput[]
}