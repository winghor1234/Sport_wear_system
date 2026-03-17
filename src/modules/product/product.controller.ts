import { NextRequest, NextResponse } from "next/server"
import { productService } from "./product.service"
import { sendSuccess, sendError } from "@/utils/response"
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
            return sendSuccess({
                data: products,
                meta
            })

        } catch (error) {
            return sendError("Failed to get products", 500, error)
        }

    },

    async getProduct(req: NextRequest, id: string) {
        try {
            const product = await productService.getProduct(id)
            return sendSuccess(product)
        } catch (error) {
            return sendError("Failed to fetch product", 500, error)

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
            return sendSuccess(product);
        } catch (error) {
            return sendError("Create product failed", 500, error);
        }
    },

    async updateProduct(req: NextRequest, id: string ) {
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
            return sendSuccess(product);
        } catch (error) {
            return sendError("Update product failed", 500, error);

        }
    },
    async deleteImage(req: NextRequest,  id: string ) {
        try {
            const image = await productService.deleteImage(id);
            return sendSuccess(image);
        } catch (error) {
            return sendError("Delete image failed", 500, error);
        }
    },

    async deleteProduct(req: NextRequest, id: string) {
        try {
            const product = await productService.deleteProduct(id)
            return sendSuccess(product)
        } catch (error) {
            console.log(error)
            return sendError("Failed to delete product", 500, error)
        }
    }   


}