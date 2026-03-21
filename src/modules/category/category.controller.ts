import { categoryService } from "./category.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
export const categoryController = {

    async getCategories(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.CategoryWhereInput = search
                ? {
                    category_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {}

            const [categories, total] = await Promise.all([

                categoryService.getCategories({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.category.count({ where })

            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: categories, meta }, "Get categories successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }

    },

    async getCategory(id: string) {
        try {
            const category = await categoryService.getCategory(id)
            return successResponse(category, "Get category successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }

    },

    async createCategory(req: Request) {
        try {
            const body = await req.json()
            const category = await categoryService.createCategory(body)
            return successResponse(category, "Create category successfully", 201)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }

    },

    async updateCategory(req: Request, id: string) {
        try {
            const body = await req.json()
            const category = await categoryService.updateCategory(id, body)
            return successResponse(category, "Update category successfully", 200)
        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }

    },

    async deleteCategory(id: string) {
        try {
            await categoryService.deleteCategory(id)
            return successResponse(null, "Delete category successfully", 200)
        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }

    }

}