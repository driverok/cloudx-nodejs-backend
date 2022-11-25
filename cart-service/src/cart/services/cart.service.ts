import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';
import {dbOptions} from "../dbOptions";
import {Client as PgClient} from 'pg';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    const pgClient = new PgClient(dbOptions);
    try {
      await pgClient.connect()
      const sql = 'SELECT * FROM carts c WHERE c.user_id = $1'
      const values = ['af059ca4-2d31-470d-937e-624dfa81a985']
      const cartsRows = (await pgClient.query(sql, values))?.rows;
      if(!Array.isArray(cartsRows) || cartsRows.length === 0) {
        throw new Error('Failed to find cart by user id')
      }
      const cart: Cart = {
        id: cartsRows[0].id,
        items: []
      }
      const sql2 = 'SELECT * FROM cart_items ci WHERE ci.cart_id = $1'
      const values2 = [cart.id]
      const cartItemsRows = (await pgClient.query(sql2, values2))?.rows;
      if(Array.isArray(cartItemsRows) && cartItemsRows.length > 0) {
        cart.items = cartItemsRows.map((cartItemRow) => {
          return {
            product: {
              id: 'test product id',
              title: 'test product title',
              price: 123,
              description: 'test description'
            },
            count: cartItemRow.count
          };
        })
      }

      return cart;
      //return this.userCarts[ userId ];
    }
    catch(e) {
      console.log('Error occured:')
      console.log(e)
      return this.userCarts[ userId ];
    }
    finally {
      pgClient.end()
    }
  }

  createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[ userId ] = userCart;

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
