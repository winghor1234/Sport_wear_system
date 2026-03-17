import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { uploadMultipleImages, convertFileToBase64, deleteImages } from "@/utils/cloudinary";
import { CreateProductInput, ProductImageInput, UpdateProductInput } from "./product.types";

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

  /* 🔥 CREATE */
  async createProduct(data: CreateProductInput) {
    let images: ProductImageInput[] = [];
    if (data.files?.length) {
      const base64Files = await Promise.all(
        data.files.map(convertFileToBase64)
      );
      const uploaded = await uploadMultipleImages(base64Files, data.folder);
      images = uploaded.map(img => ({
        image_url: img.url,
        public_id: img.publicId
      }));
    }

    return prisma.product.create({
      data: {
        product_name: data.product_name,
        description: data.description,
        price: data.price,
        stock_qty: data.stock_qty,
        category_id: data.category_id,
        images: {
          create: images
        }
      },
      include: { images: true }
    });
  },

  /* 🔥 UPDATE (replace images) */
  async updateProduct(productId: string, data: UpdateProductInput) {

    const product = await prisma.product.findUnique({
      where: { product_id: productId },
      include: { images: true }
    });

    if (!product) {
      throw new Error("Product not found");
    }

   let images: ProductImageInput[] = [];

    /* 🔥 ถ้ามีรูปใหม่ */
    if (data.files?.length) {

      /* ✅ 1. upload ใหม่ก่อน (กัน data loss) */
      const base64Files = await Promise.all(
        data.files.map(convertFileToBase64)
      );

      const uploaded = await uploadMultipleImages(
        base64Files,
        data.folder ?? "products"
      );

      images = uploaded.map(img => ({
        image_url: img.url,
        public_id: img.publicId
      }));

      /* ✅ 2. ลบของเก่า */
      if (product.images.length) {

        await deleteImages(product.images.map(i => i.public_id));

        await prisma.productImage.deleteMany({
          where: { product_id: productId }
        });
      }
    }

    /* 🔥 update product */
    return prisma.product.update({
      where: { product_id: productId },
      data: {
        product_name: data.product_name,
        price: data.price,
        stock_qty: data.stock_qty,
        description: data.description,
        category_id: data.category_id,

        ...(images.length > 0 && {
          images: {
            create: images
          }
        })
      },
      include: { images: true }
    });
  },

  /* 🔥 DELETE IMAGE */
  async deleteImage(imageId: string) {

    const image = await prisma.productImage.findUnique({
      where: { image_id: imageId }
    });

    if (!image) throw new Error("Image not found");

    await deleteImages([image.public_id]);

    await prisma.productImage.delete({
      where: { image_id: imageId }
    });

    return true;
  },


  async deleteProduct(productId: string) {

    const product = await prisma.product.findUnique({
      where: { product_id: productId },
      include: { images: true }
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.images.length) {
      await deleteImages(product.images.map(i => i.public_id));
    }

    await prisma.product.delete({
      where: { product_id: productId }
    });

    return true;
  }

}