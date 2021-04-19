import Product from '../../models/interfaces/Product';
import Cart from '../../models/interfaces/Cart';

interface CartRepositoryPatch {
  updateCart(id: string, products: Product[]): Promise<Cart>;
}

export default CartRepositoryPatch;
