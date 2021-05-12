interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discountPercentage: number;
  available: boolean;
  evidence: boolean;
  categories: string[];
  images: string[];
}

export default Product;
