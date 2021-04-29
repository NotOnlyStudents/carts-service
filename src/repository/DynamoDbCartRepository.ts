import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import Product from '../models/interfaces/Product';
import Cart from '../models/interfaces/Cart';
import CartRepositoryGet from './interfaces/CartRepositoryGet';
import CartRepositoryPost from './interfaces/CartRepositoryPost';
import CartRepositoryPatch from './interfaces/CartRepositoryPatch';
import DynamoDbCartProduct from 'src/models/DynamoDbCartProduct';
import RealCart from '../models/RealCart';

class DynamoDbCartRepository implements CartRepositoryGet, CartRepositoryPost, CartRepositoryPatch {
  private mapper: DataMapper;

  constructor(dynamodb: DynamoDB) {
    this.mapper = new DataMapper({ client: dynamodb });
  }

  getCart = async (id: string): Promise<Cart> => {
    const asyncIterator = this.mapper.query(DynamoDbCartProduct, { cartId: id });
    const cart = new RealCart(id);
    for await (const product of asyncIterator) {
      cart.products.push(product);
    }
    return cart;
  }

  createCart = async (cart: Cart): Promise<Cart> => {
    cart.products.forEach(product => (
      this.mapper.put(
        new DynamoDbCartProduct(
          product.id, 
          cart.id, 
          product.name, 
          product.description, 
          product.price, 
          product.quantity, 
          product.available, 
          product.evidence, 
          product.categories, 
          product.images
        )
      )
    ));
    return cart;
  }

  updateCart = async (id: string, products: Product[]): Promise<Cart> => {
    products.forEach(product => (
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
          product.images
        )
      )
    ))

    return new RealCart(id, products);
  };
}

export default DynamoDbCartRepository;
