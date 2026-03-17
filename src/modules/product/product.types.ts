

export type CreateProductInput = {
  product_name: string;
  price: number;
  stock_qty: number;
  category_id: string;
  description?: string;
  files?: File[];
  folder?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;


export type ProductImageInput = {
  image_url: string;
  public_id: string;
};