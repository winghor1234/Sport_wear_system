export interface CreateOrderDetailInput {
  product_id: string
  quantity: number
  price: number
}

export interface CreateOrderInput {
  customer_id: string
  total_amount: number
  order_details: CreateOrderDetailInput[]
}