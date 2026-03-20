
import { categoryController } from "@/modules/category/category.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return categoryController.getCategories(req)
}

export async function POST(req: Request) {
  return categoryController.createCategory(req)
}