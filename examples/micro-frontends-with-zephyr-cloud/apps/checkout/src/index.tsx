import './css/index.css';
import { lazy } from 'react';

const CartPage = lazy(() => import('./CartPage'));
const Checkout = lazy(() => import('./Checkout'));
const Thanks = lazy(() => import('./Thanks'));
const AddToCart = lazy(() => import('./AddToCart'));
const MiniCart = lazy(() => import('./MiniCart'));
