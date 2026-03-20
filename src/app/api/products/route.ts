import { productController } from "@/modules/product/product.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return productController.getProducts(req)
}

export async function POST(req: NextRequest) {
  return productController.createProduct(req)

}