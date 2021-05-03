import Product from 'src/models/interfaces/Product';

export default interface CartRepositoryDelete {
  deleteProduct(productId: string): Promise<AsyncIterableIterator<Product>>
}
