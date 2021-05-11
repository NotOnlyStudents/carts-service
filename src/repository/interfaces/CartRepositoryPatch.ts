import Product from '../../models/interfaces/Product';

interface CartRepositoryPatch {
  updateAllCarts(product: Product): Promise<Promise<Product>[]>;
  updateProductQuantity(cartId: string, productId: string, quantity: number): Promise<Product>;
}

export default CartRepositoryPatch;
