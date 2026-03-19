export type RefundItemInput = {
  product_id: string
  quantity: number
  price: number
}

export type CreateRefundInput = {
  sale_id: string
  refund_details: RefundItemInput[]
}