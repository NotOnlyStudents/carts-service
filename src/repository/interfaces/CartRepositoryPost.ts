import Product from 'src/models/interfaces/Product';
import Cart from '../../models/interfaces/Cart';

interface CartRepositoryPost {
  addProductsToCart(id: string, products: Product[]): Promise<Cart>;
}

export default CartRepositoryPost;
