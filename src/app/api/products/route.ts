import { prisma } from "@/lib/prisma"
import { productService } from "@/modules/product/product.service"
import { handleError } from "@/utils/errorHandler"
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { sendError, sendSuccess } from "@/utils/response"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { page, limit, skip } = getPaginationParams(req)
    const search = getSearchParam(req)
    const orderBy = getSortingParams(req)
    const where: Prisma.ProductWhereInput = search
      ? {
          product_name: {
            contains: search,
            mode: "insensitive"
          }
        }
      : {}

    const [products, total] = await Promise.all([
      productService.getProducts({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true
        },
      }),
      prisma.product.count({ where })
    ]);
    const meta = getPaginationMeta(total, page, limit)
    return sendSuccess({
      data: products,
      meta
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = await productService.createProduct(body)
    return sendSuccess(product)
  } catch (error) {
    sendError("Internal Product Server Error", 500, error)
  }
}

