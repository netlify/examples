import {createContext, useContext, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Cart} from '@shopify/hydrogen-react/storefront-api-types';

const CartContext = createContext<Cart | undefined>(undefined);

export function CartProvider({children}: {children: React.ReactNode}) {
  const fetcher = useFetcher<Cart | undefined>();

  useEffect(() => {
    if (fetcher.state === 'loading') return;
    if (fetcher.data) return;

    fetcher.load('/cart');
  }, [fetcher]);

  return (
    <CartContext.Provider value={fetcher.data}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
