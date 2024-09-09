import * as React from 'react';
import LineItem from './components/LineItem';
import Button from './components/Button';
import data from './data/db.json';
import { useLineItems } from './data/store';
import './css/CartPage.css'

const Header = React.lazy(() => import('tractor_v2_explore/Header'));
const Footer = React.lazy(() => import('tractor_v2_explore/Footer'));
const Recommendations = React.lazy(() => import('tractor_v2_explore/Recommendations'));

function convertToLineItems(items: Array<{ sku: string; quantity: number }>) {
  return items.reduce((res, { sku, quantity }) => {
    const variant = data.variants.find((p) => p.sku === sku);
    if (variant) {
      res.push({ ...variant, quantity, total: variant.price * quantity });
    }
    return res;
  }, []);
}

const CartPage: React.FC = () => {
  const rawLineItems = useLineItems();
  const lineItems = convertToLineItems(rawLineItems);
  const total = lineItems.reduce((res, { total }) => res + total, 0);
  const skus = lineItems.map(({ sku }) => sku);

  return (
    <div data-boundary-page="checkout">
      <Header />
      <main className="c_CartPage">
        <h2>Basket</h2>
        <ul className="c_CartPage__lineItems">
          {lineItems.map((li, i) => (
            <LineItem key={i} {...li} />
          ))}
        </ul>
        <hr />
        <p className="c_CartPage__total">Total: {total} Ø</p>
        <div className="c_CartPage__buttons">
          <Button href="/checkout/checkout" variant="primary">
            Checkout
          </Button>
          <Button href="/" variant="secondary">
            Continue Shopping
          </Button>
        </div>
        <Recommendations skus={skus} />
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
