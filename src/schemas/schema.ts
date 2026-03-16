import { z } from "zod"

// Product Schema
export const productSchema = z.object({
  product_name: z.string().min(1),
  price: z.number(),
  stock_qty: z.number(),
  category_id: z.string()
})
export type ProductInput = z.infer<typeof productSchema>
export const productUpdateSchema = productSchema.partial()
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>



// Category Schema
export const categorySchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  description: z.string().optional()
})
export type CategoryInput = z.infer<typeof categorySchema>
export const categoryUpdateSchema = categorySchema.partial()
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>







// Customer Schema
export const customerSchema = z.object({
  customer_name: z.string().min(1),
  phone: z.string().min(5),
  address: z.string().optional(),
  email: z.string().email().optional()
})
export type CustomerInput = z.infer<typeof customerSchema>
export const customerUpdateSchema = customerSchema.partial()
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>



// Supplier Schema
export const supplierSchema = z.object({
  supplier_name: z.string().min(1),
  phone: z.string(),
  address: z.string().optional()
})
export type SupplierInput = z.infer<typeof supplierSchema>
export const supplierUpdateSchema = supplierSchema.partial()
export type SupplierUpdateInput = z.infer<typeof supplierUpdateSchema>



// Purchase Schema
export const purchaseDetailSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0)
})
export const purchaseSchema = z.object({
  supplier_id: z.number(),
  employee_id: z.number(),
  purchase_date: z.date().optional(),
  items: z.array(purchaseDetailSchema)
})
export type PurchaseInput = z.infer<typeof purchaseSchema>




// Import Schema
export const importDetailSchema = z.object({
  product_id: z.number(),
  quantity: z.number(),
  cost_price: z.number()
})
export const importSchema = z.object({
  purchase_id: z.number(),
  employee_id: z.number(),
  import_date: z.date().optional(),
  items: z.array(importDetailSchema)
})
export type ImportInput = z.infer<typeof importSchema>




// Order Schema
export const orderItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
  price: z.number()
})
export const orderSchema = z.object({
  customer_id: z.number(),
  status: z.string().optional(),
  items: z.array(orderItemSchema)
})
export type OrderInput = z.infer<typeof orderSchema>




// Sale Schema
export const saleItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
  price: z.number()
})
export const saleSchema = z.object({
  employee_id: z.number(),
  customer_id: z.number().optional(),
  items: z.array(saleItemSchema)
})
export type SaleInput = z.infer<typeof saleSchema>


// auth customer login schema
export const customerLoginAuthSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string(),
  password: z.string(),
  point: z.number().optional()

})
export type CustomerLoginInput = z.infer<typeof customerLoginAuthSchema>

// auth customer register schema
export const customerRegisterSchema = z.object({
  customer_name: z.string(),
  phone: z.string(),
  password: z.string(),
  email: z.string().email(),
  gender: z.string().optional(),
  address: z.string().optional()
})
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>


// auth admin login schema
export const adminAuthSchema = z.object({ 
  username: z.string(),password: z.string()
})
export type AdminAuthInput = z.infer<typeof adminAuthSchema>