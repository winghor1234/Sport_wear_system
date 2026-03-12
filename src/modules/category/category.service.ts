import { prisma } from "@/lib/prisma"
import { CategoryInput, categorySchema } from "@/schemas/schema"
import { Prisma } from "@prisma/client"

export const categoryService = {
  async getCategories(options?: Prisma.CategoryFindManyArgs) {
    return prisma.category.findMany(options)
  },

  async getCategory(id: string) {
    return prisma.category.findUnique({
      where: { category_id: id }
    })
  },

  async createCategory(data: CategoryInput) {
    const validated = categorySchema.parse(data)
    return prisma.category.create({ data: validated })
  },

  async updateCategory(id: string, data: CategoryInput) {
    return prisma.category.update({
      where: { category_id: id },
      data
    })
  },

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { category_id: id }
    })
  }
}