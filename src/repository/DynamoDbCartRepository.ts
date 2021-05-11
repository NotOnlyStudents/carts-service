import { equals, UpdateExpression } from '@aws/dynamodb-expressions';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import DynamoDbCartProduct from 'src/models/DynamoDbCartProduct';
import Product from '../models/interfaces/Product';
import Cart from '../models/interfaces/Cart';
import CartRepositoryGet from './interfaces/CartRepositoryGet';
import CartRepositoryPost from './interfaces/CartRepositoryPost';
import CartRepositoryPatch from './interfaces/CartRepositoryPatch';
import RealCart from '../models/RealCart';
import CartRepositoryDelete from './interfaces/CartRepositoryDelete';

class DynamoDbCartRepository implements
  CartRepositoryGet,
  CartRepositoryPost,
  CartRepositoryPatch,
  CartRepositoryDelete {
  private mapper: DataMapper;

  constructor(dynamodb: DynamoDB) {
    this.mapper = new DataMapper({ client: dynamodb });
  }

  deleteProductFromCart = async (
    cartId: string,
    productId: string,
  ): Promise<Product> => this.mapper.delete(new DynamoDbCartProduct(productId, cartId));

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

  addProductToCart = async (cartId: string, product: Product): Promise<Product> => {
    const dynamoProduct = new DynamoDbCartProduct(
      product.id,
      cartId,
      product.name,
      product.description,
      product.price,
      product.quantity,
      product.available,
      product.discountPercentage,
      product.evidence,
      product.categories,
      product.images,
    );
    return this.mapper.put(dynamoProduct);
  };

  updateProductQuantity = async (
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<Product> => {
    const expression = new UpdateExpression();
    expression.set('quantity', quantity);
    return this.mapper.executeUpdateExpression(
      expression, {
        cartId,
        id: productId,
      }, DynamoDbCartProduct, {
        condition: {
          ...equals(productId),
          subject: 'id',
        },
      },
    );
  };

  private cartsScan = async (
    productId: string,
  ): Promise<AsyncIterableIterator<DynamoDbCartProduct>> => this.mapper.scan(DynamoDbCartProduct, {
    filter: {
      ...equals(productId),
      subject: 'id',
    },
  });

  deleteProduct = async (productId: string): Promise<AsyncIterableIterator<Product>> => {
    const asyncIterator = await this.cartsScan(productId);

    return this.mapper.batchDelete(asyncIterator);
  };

  updateAllCarts = async (product: Product): Promise<Promise<Product>[]> => {
    const asyncIterator = await this.cartsScan(product.id);
    let result: Promise<Product>[] = [];
    for await (const dynamoProduct of asyncIterator) {
      const expression = new UpdateExpression();
      expression.set('name', product.name);
      expression.set('description', product.description);
      expression.set('price', product.price);
      expression.set('quantity', product.quantity);
      expression.set('discountPercentage', product.discountPercentage);
      expression.set('categories', product.categories);
      expression.set('images', product.images);

      console.log(await this.mapper.executeUpdateExpression(
        expression, {
          cartId: dynamoProduct.cartId,
          id: product.id
        }, DynamoDbCartProduct, {
          condition: {
            ...equals(product.id),
            subject: 'id',
          },
        },
      ));
      result.push(this.mapper.executeUpdateExpression(
        expression, {
          cartId: dynamoProduct.cartId,
          id: product.id
        }, DynamoDbCartProduct, {
          condition: {
            ...equals(product.id),
            subject: 'id',
          },
        },
      ));
    }
    return result;
  };
}

export default DynamoDbCartRepository;
