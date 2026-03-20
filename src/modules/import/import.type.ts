export type ImportItemInput = {
    product_id: string
    quantity: number
    cost_price: number
}

export type CreateImportInput = {
    purchase_id: string
    item: ImportItemInput[]
}