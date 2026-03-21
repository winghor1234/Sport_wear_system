import { NextRequest } from "next/server"
import { productService } from "./product.service"
import { BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, errorResponse, successResponse } from "@/utils/response"
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { formDataParser } from "@/utils/cloudinary"

export const productController = {

    async getProducts(req: NextRequest) {

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
                    orderBy
                }),
                prisma.product.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: products, meta }, "Get products successfully", 200)

        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }

    },

    async getProduct(req: NextRequest, id: string) {
        try {
            const product = await productService.getProduct(id)
            return successResponse(product, "Get product successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }
    },


    async createProduct(req: NextRequest) {
        try {
            const formData = await req.formData();
            const product = await productService.createProduct({
                product_name: formData.get("name") as string,
                description: formData.get("description") as string,
                price: Number(formData.get("price")),
                stock_qty: Number(formData.get("stock")),
                category_id: formData.get("categoryId") as string,
                folder: "products",
                files: formData.getAll("images") as File[]
            });
            return successResponse(product, "Product created successfully", 201);
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async updateProduct(req: NextRequest, id: string) {
        try {
            const formData = await req.formData();
            const product = await productService.updateProduct(id, {
                product_name: formDataParser.string(formData, "name"),
                price: formDataParser.number(formData, "price"),
                stock_qty: formDataParser.number(formData, "stock"),
                description: formDataParser.string(formData, "description"),
                category_id: formDataParser.string(formData, "categoryId"),
                files: formData.getAll("images") as File[]
            });
            return successResponse(product, "Product updated successfully", 201);
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }
    },
    async deleteImage(req: NextRequest, id: string) {
        try {
            const image = await productService.deleteImage(id);
            return successResponse(image, "Image deleted successfully", 200);
        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
        }
    },

    async deleteProduct(req: NextRequest, id: string) {
        try {
            const product = await productService.deleteProduct(id)
            return successResponse(product, "Product deleted successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    }


}