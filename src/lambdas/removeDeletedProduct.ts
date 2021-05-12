import { SNSMessage, SQSEvent } from 'aws-lambda';
import Product from 'src/models/interfaces/Product';
import ProductDeletedMessage from 'src/models/messages/ProductDeletedMessage';
import CartRepositoryDelete from 'src/repository/interfaces/CartRepositoryDelete';
import * as Validator from 'validatorjs';

const removeDeletedProduct = async (
  event: SQSEvent,
  repository: CartRepositoryDelete,
): Promise<Product[]> => {
  const record = event.Records[0];
  const msg: SNSMessage = JSON.parse(record.body);
  const payload: ProductDeletedMessage = JSON.parse(msg.Message);
  const validator = new Validator(payload, {
    productId: 'required|string',
  });

  if (validator.fails()) {
    throw new Error(validator.errors.first('productId') as string);
  }

  return repository.deleteProduct(payload.productId);
};

export default removeDeletedProduct;
