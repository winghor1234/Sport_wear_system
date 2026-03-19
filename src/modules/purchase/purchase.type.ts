export type CreatePurchaseInput = {
  supplier_id: string
  purchase_details: CreatePurchaseItemInput[]
}
export type CreatePurchaseItemInput = {
  product_id: string
  quantity: number
  price: number
}

export type UpdatePurchaseInput = {
  supplier_id: string
  total_amount: number
  purchase_details: CreatePurchaseItemInput[]
}