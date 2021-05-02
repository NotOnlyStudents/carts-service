import { UpdateExpression } from "@aws/dynamodb-expressions";
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import DynamoDbCartProduct from 'src/models/DynamoDbCartProduct';
import Product from '../models/interfaces/Product';
import Cart from '../models/interfaces/Cart';
import CartRepositoryGet from './interfaces/CartRepositoryGet';
import CartRepositoryPost from './interfaces/CartRepositoryPost';
import CartRepositoryPatch from './interfaces/CartRepositoryPatch';
import RealCart from '../models/RealCart';

class DynamoDbCartRepository implements CartRepositoryGet, CartRepositoryPost, CartRepositoryPatch {
  private mapper: DataMapper;

  constructor(dynamodb: DynamoDB) {
    this.mapper = new DataMapper({ client: dynamodb });
  }

  getCart = async (id: string): Promise<Cart> => {
    const asyncIterator = this.mapper.query(DynamoDbCartProduct, { cartId: id });
    const cart = new RealCart(id);
    for await (const dynamoProduct of asyncIterator) {
      const product = { ...dynamoProduct };
      delete product.cartId;
      cart.products.push(product);
    }
    return cart;
  };

  addProductToCart = async (id: string, product: Product): Promise<Product> => {
    const dynamoProduct = new DynamoDbCartProduct(
      product.id,
      id,
      product.name,
      product.description,
      product.price,
      product.quantity,
      product.available,
      product.evidence,
      product.categories,
      product.images,
    );
    return this.mapper.put(dynamoProduct);
  };

  updateProductQuantity = async (
    cartId: string, 
    productId: string, 
    quantity: number
  ): Promise<Product> => {
    const expression = new UpdateExpression();
    expression.set("quantity", quantity);
    return this.mapper.executeUpdateExpression(expression, { cartId, id: productId }, DynamoDbCartProduct);
  }

  updateCart = async (id: string, products: Product[]): Promise<Cart> => {
    products.forEach((product) => (
      this.mapper.update(
        new DynamoDbCartProduct(
          product.id,
          id,
          product.name,
          product.description,
          product.price,
          product.quantity,
          product.available,
          product.evidence,
          product.categories,
          product.images,
        ),
      )
    ));

    return new RealCart(id, products);
  };
}

export default DynamoDbCartRepository;
