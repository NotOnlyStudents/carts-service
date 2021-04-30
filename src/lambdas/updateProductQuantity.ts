import { APIGatewayProxyEvent } from 'aws-lambda';
import CartResponse from 'src/models/CartResponse';
import ProductToken from 'src/models/ProductToken';
import CartRepositoryPatch from 'src/repository/interfaces/CartRepositoryPatch';

const checkTokens = async (
  tokens: ProductToken[],
): Promise<boolean> => tokens.every(
  (token) => token.checkTimout() && token.checkHmac(),
);

const updateProductQuantity = async (
  cartId: string,
  event: APIGatewayProxyEvent,
  repository: CartRepositoryPatch,
): Promise<CartResponse> => {
  try {
    const bodyTokens: ProductToken[] = JSON.parse(event.body);
    const tokens: ProductToken[] = [];
    for (const token of bodyTokens) {
      tokens.push(new ProductToken(token));
    }

    if (!Array.isArray(tokens) || !tokens.reduce((acc, token) => (
      acc && token instanceof ProductToken
    ), true)) {
      return new CartResponse(400, { message: 'Request body is in wrong format' });
    }

    if (!await checkTokens(tokens)) return new CartResponse(500, { message: 'Token expired or invalid' });

    // Extract products
    const products = tokens.map((token) => token.token.data);
    await repository.addProductsToCart(cartId, products);

    return new CartResponse(204);
  } catch (error) {
    console.error(event, error);
    return new CartResponse(500, { message: 'Unexpected error' });
  }
};

export default updateProductQuantity;
