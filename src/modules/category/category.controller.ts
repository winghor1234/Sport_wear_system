import { categoryService } from "./category.service"
import { prisma } from "@/lib/prisma"

import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"

import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"

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

            return sendSuccess({
                data: categories,
                meta
            })

        } catch (error) {

            return handleError(error)

        }

    },

    async getCategory(id: string) {

        try {

            const category = await categoryService.getCategory(id)

            return sendSuccess(category)

        } catch (error) {

            return handleError(error)

        }

    },

    async createCategory(req: Request) {

        try {

            const body = await req.json()

            const category = await categoryService.createCategory(body)

            return sendSuccess(category)

        } catch (error) {

            return handleError(error)

        }

    },

    async updateCategory(req: Request, id: string) {

        try {

            const body = await req.json()

            const category = await categoryService.updateCategory(id, body)

            return sendSuccess(category)

        } catch (error) {

            return handleError(error)

        }

    },

    async deleteCategory(id: string) {

        try {

            await categoryService.deleteCategory(id)

            return sendSuccess({
                message: "Category deleted"
            })

        } catch (error) {

            return handleError(error)

        }

    }

}