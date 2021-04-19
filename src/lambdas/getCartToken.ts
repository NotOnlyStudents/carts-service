import { ItemNotFoundException } from '@aws/dynamodb-data-mapper';
import { APIGatewayProxyEvent } from 'aws-lambda';
import CartResponse from 'src/models/CartResponse';
import CartRepositoryGet from 'src/repository/interfaces/CartRepositoryGet';

const getCartToken = async (
  event: APIGatewayProxyEvent,
  repository: CartRepositoryGet,
): Promise<CartResponse> => {
  const { id } = event.pathParameters;

  try {
    const cart = await repository.getCart(id);
    const { products } = cart;

    // TODO: timeout date&time, hmac calculation
    return new CartResponse(200, {
      token: {
        data: {
          products,
        },
        timeout: new Date(),
      },
      hmac: '',
    });
  } catch (error) {
    if (error instanceof ItemNotFoundException) return new CartResponse(404);
    return new CartResponse(500);
  }
};

export default getCartToken;
