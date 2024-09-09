import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Home = lazy(() => import('tractor_v2_explore/HomePage'));
const CategoryPage = lazy(() => import('tractor_v2_explore/CategoryPage'));
const StoresPage = lazy(() => import('tractor_v2_explore/StoresPage'));
const CartPage = lazy(() => import('tractor_v2_checkout/CartPage'));
const Checkout = lazy(() => import('tractor_v2_checkout/Checkout'));
const Thanks = lazy(() => import('tractor_v2_checkout/Thanks'));
const ProductPage = lazy(() => import('tractor_v2_decide/ProductPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={'Loading...'}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/checkout/cart',
    element: (
      <Suspense fallback={'Loading...'}>
        <CartPage />
      </Suspense>
    ),
  },
  {
    path: '/checkout/checkout',
    element: (
      <Suspense fallback={'Loading...'}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: '/checkout/thanks',
    element: (
      <Suspense fallback={'Loading...'}>
        <Thanks />
      </Suspense>
    ),
  },
  {
    path: '/product/:id',
    element: (
      <Suspense fallback={'Loading...'}>
        <ProductPage />
      </Suspense>
    ),
  },
  {
    path: '/products/:category?',
    element: (
      <Suspense fallback={'Loading...'}>
        <CategoryPage />
      </Suspense>
    ),
  },
  {
    path: '/stores',
    element: (
      <Suspense fallback={'Loading...'}>
        <StoresPage />
      </Suspense>
    ),
  },
]);
