import { prisma } from "@/lib/prisma"
import { BadRequestError, NotFoundError } from "@/utils/response";
import { Prisma } from "@prisma/client"

export const categoryService = {

  async getCategories(options?: Prisma.CategoryFindManyArgs) {
    const categories = await prisma.category.findMany(options);
    return categories;

  },

  async getCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { category_id: id }
    })
    return category
  },

  async createCategory(data: Prisma.CategoryCreateInput) {
    const category = await prisma.category.create({
      data
    });
    if (!category) {
      throw new BadRequestError("Category not created");
    }
    return category;


  },

  async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {

    const category = await prisma.category.update({
      where: { category_id: id },
      data
    });
    if (!category) {
      throw new BadRequestError("Category not updated");
    }
    return category;



  },

  async deleteCategory(id: string) {

    const category = await prisma.category.findUnique({
      where: { category_id: id },
      include: {
        products: true
      }
    })

    if (!category) {
      throw new NotFoundError("Category not found")
    }

    // ❌ ห้ามลบถ้ายังมีสินค้า
    if (category.products.length > 0) {
      throw new BadRequestError("Cannot delete category with products")
    }

    return prisma.category.delete({
      where: { category_id: id }
    })
  }

}