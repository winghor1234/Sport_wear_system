export interface CreateOrderDetailInput {
  product_id: string
  quantity: number
  price: number
}

export interface CreateOrderInput {
  customer_id: string
  order_details: CreateOrderDetailInput[]
}