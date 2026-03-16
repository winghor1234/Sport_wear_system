import { NextRequest } from "next/server"
import { productService } from "./product.service"
import { sendSuccess, sendError } from "@/utils/response"
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export const productController = {

    async getProducts(req: NextRequest) {

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
                orderBy
            }),

            prisma.product.count({ where })

        ])

        const meta = getPaginationMeta(total, page, limit)

        return sendSuccess({
            data: products,
            meta
        })

    },

    async getProduct(req: Request, id: string) {

        try {

            const product = await productService.getProduct(id)

            return sendSuccess(product)

        } catch (error) {

            return sendError("Failed to fetch product", 500, error)

        }

    },

    async createProduct(req: Request) {

        try {

            const body = await req.json()

            const product = await productService.createProduct(body)

            return sendSuccess(product)

        } catch (error) {

            return sendError("Create product failed", 500, error)

        }

    },

    async updateProduct(req: Request, id: string) {

        try {

            const body = await req.json()

            const product = await productService.updateProduct(id, body)

            return sendSuccess(product)

        } catch (error) {

            return sendError("Update product failed", 500, error)

        }

    },

    async deleteProduct(id: string) {

        try {

            await productService.deleteProduct(id)

            return sendSuccess({
                message: "Product deleted"
            })

        } catch (error) {

            return sendError("Delete product failed", 500, error)

        }

    }

}