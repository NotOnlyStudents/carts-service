import Cart from '../../models/interfaces/Cart';

interface CartRepositoryPost {
  createCart(cart: Cart): Promise<Cart>;
}

export default CartRepositoryPost;
