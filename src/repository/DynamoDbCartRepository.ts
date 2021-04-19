import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import Product from '../models/interfaces/Product';
import Cart from '../models/interfaces/Cart';
import DynamoDbCart from '../models/DynamoDbCart';
import CartRepositoryGet from './interfaces/CartRepositoryGet';
import CartRepositoryPost from './interfaces/CartRepositoryPost';
import CartRepositoryPatch from './interfaces/CartRepositoryPatch';

class DynamoDbCartRepository implements CartRepositoryGet, CartRepositoryPost, CartRepositoryPatch {
  private mapper: DataMapper;

  constructor(dynamodb: DynamoDB) {
    this.mapper = new DataMapper({ client: dynamodb });
  }

  getCart = async (id: string): Promise<Cart> => this.mapper.get(new DynamoDbCart(id));

  createCart = async (cart: Cart): Promise<Cart> => this.mapper.put(cart);

  updateCart = async (id: string, products: Product[]): Promise<Cart> => {
    const cart = new DynamoDbCart(id, products);
    return this.mapper.update(cart, { onMissing: 'skip' });
  };
}

export default DynamoDbCartRepository;
