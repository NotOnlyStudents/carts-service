import { ItemNotFoundException } from '@aws/dynamodb-data-mapper';
import { APIGatewayProxyEvent } from 'aws-lambda';
import CartResponse from 'src/models/CartResponse';
import CartToken from 'src/models/CartToken';
import CartRepositoryGet from 'src/repository/interfaces/CartRepositoryGet';

const getCartToken = async (
  event: APIGatewayProxyEvent,
  repository: CartRepositoryGet,
): Promise<CartResponse> => {
  // TODO: get cart id from cognito
  const cartId = "1";

  try {
    const cart = await repository.getCart(cartId);

    const token = new CartToken(cart.products)

    return new CartResponse(200, token);
  } catch (error) {
    console.error(error);

    if (error instanceof ItemNotFoundException) return new CartResponse(404, { 
      message: `Cart with id ${cartId} not found`
    });
    return new CartResponse(500, { message: `Unexpected error` });
  }
};

export default getCartToken;
