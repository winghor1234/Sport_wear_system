
// import { prisma } from "@/lib/prisma"
// import { ProductInput, productSchema, ProductUpdateInput } from "@/schemas/schema"
// import { Prisma } from "@prisma/client"


// export const productService = {

//   async getProducts(options?: Prisma.ProductFindManyArgs) {
//     return prisma.product.findMany(options)
//   },

//   async getProduct(id: string) {
//     const product = await prisma.product.findUnique({
//       where: { product_id: id }
//     })
//     if (!product) {
//       throw new Error("Product not found!!")
//     }
//     return product
//   },

//   async createProduct(data: ProductInput) {
//     const validated = productSchema.parse(data)
//     const product = await prisma.product.create({ data: validated })
//     if (!product) {
//       throw new Error(" Invalid product created!!")
//     }
//     return product
//   },

//   async updateProduct(id: string, data: ProductUpdateInput) {
//     const product = await prisma.product.update({
//       where: { product_id: id },
//       data
//     })
//     if (!product) {
//       throw new Error("Invalid product updated!!")
//     }
//     return product
//   },

//   async deleteProduct(id: string) {
//     const product = await prisma.product.delete({
//       where: { product_id: id }
//     })
//     if (!product) {
//       throw new Error("Invalid product deleted!!")
//     }
//     return product

//   }
// }

import { prisma } from "@/lib/prisma"
import { CreateProductInput, UpdateProductInput } from "./product.types"
import { Prisma } from "@prisma/client"

export const productService = {

  async getProducts(options?: Prisma.ProductFindManyArgs) {

    return prisma.product.findMany({
      ...options,
      include: {
        category: true,
        images: true
      }
    })

  },

  async getProduct(id: string) {

    const product = await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        category: true,
        images: true
      }
    })

    if (!product) {
      throw new Error("Product not found")
    }

    return product

  },

  async createProduct(data: CreateProductInput) {

    return prisma.product.create({
      data
    })

  },

  async updateProduct(id: string, data: UpdateProductInput) {

    return prisma.product.update({
      where: { product_id: id },
      data
    })

  },

  async deleteProduct(id: string) {

    return prisma.product.delete({
      where: { product_id: id }
    })

  }

}