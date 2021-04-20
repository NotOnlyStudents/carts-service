import { ItemNotFoundException } from '@aws/dynamodb-data-mapper';
import { APIGatewayProxyEvent } from 'aws-lambda';
import CartResponse from 'src/models/CartResponse';
import ProductToken from 'src/models/ProductToken';
import CartRepositoryPatch from 'src/repository/interfaces/CartRepositoryPatch';

const checkTokens = async (
  tokens: ProductToken[]
): Promise<boolean> => {
  return tokens.every(
    token => token.checkTimout() && token.checkHmac() 
  );
}

const editCart = async (
  event: APIGatewayProxyEvent,
  repository: CartRepositoryPatch,
): Promise<CartResponse> => {
  // TODO: get email from cognito
  const cartId = "1";

  try {
    const bodyTokens: ProductToken[] = JSON.parse(event.body);
    const tokens: ProductToken[] = [];
    for (const token of bodyTokens) {
      tokens.push(new ProductToken(token));
    }

    if (!Array.isArray(tokens) || !tokens.reduce((acc, token) => acc && token instanceof ProductToken, true)) {
      return new CartResponse(400, { message: `Request body is in wrong format` });
    }

    if (!await checkTokens(tokens)) return new CartResponse(500, { message: `Token expired or invalid` })

    // Extract products
    const products = tokens.map(token => token.token.data);
    await repository.updateCart(cartId, products);

    return new CartResponse(204);
  } catch (error) {
    console.error(error);

    if (error instanceof ItemNotFoundException) return new CartResponse(404, {
      message: `Cart with id ${cartId} not found`
    });
    return new CartResponse(500, { message: `Unexpected error` });
  }
};

export default editCart;
