import './css/index.css';
import { lazy } from 'react';

const HomePage = lazy(() => import('./HomePage'));
const CategoryPage = lazy(() => import('./CategoryPage'));
const StoresPage = lazy(() => import('./StoresPage'));
const Recommendations = lazy(() => import('./Recommendations'));
const StorePicker = lazy(() => import('./StorePicker'));
const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));
