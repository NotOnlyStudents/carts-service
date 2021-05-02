import { APIGatewayProxyEvent } from 'aws-lambda';
import CartResponse from 'src/models/CartResponse';
import ProductToken from 'src/models/ProductToken';
import CartRepositoryPatch from 'src/repository/interfaces/CartRepositoryPatch';
import * as Validator from 'validatorjs';

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
    const pathValidator = new Validator(event.pathParameters, {
      productId: 'string|required'
    });
    if (pathValidator.fails()) {
      return new CartResponse(400, { message: pathValidator.errors.first('productId').toString() });
    }

    const payload: { quantity: number } = JSON.parse(event.body);
    const payloadValidator = new Validator(payload, {
      quantity: 'integer|min:1'
    })
    if (payloadValidator.fails()) {
      return new CartResponse(400, { message: payloadValidator.errors.first('quantity').toString() });
    }

    const { productId } = event.pathParameters;
    const { quantity } = payload;

    const product = await repository.updateProductQuantity(cartId, productId, quantity);
    console.log(product);

    return new CartResponse(204);
  } catch (error) {
    console.error(event, error);
    return new CartResponse(500, { message: 'Unexpected error' });
  }
};

export default updateProductQuantity;
