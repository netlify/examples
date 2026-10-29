import {createContext, useContext, useEffect} from 'react';
import {useFetcher} from 'react-router';
import type {Customer} from '@shopify/hydrogen-react/storefront-api-types';

const CustomerContext = createContext<Customer | undefined>(undefined);

export function CustomerProvider({children}: {children: React.ReactNode}) {
  const fetcher = useFetcher<Customer>();

  useEffect(() => {
    if (fetcher.data || fetcher.state === 'loading') return;

    void fetcher.load('/account');
  }, [fetcher]);

  return (
    <CustomerContext.Provider value={fetcher.data}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
