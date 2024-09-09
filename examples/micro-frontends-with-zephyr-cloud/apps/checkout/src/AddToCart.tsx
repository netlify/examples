import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import data from './data/db.json';
import Button from './components/Button';
import './css/AddToCart.css';

type AddToCardProps = {
  sku: string;
};

const AddToCart: React.FC<AddToCardProps> = ({ sku }) => {
  console.log('------------------ data from AddToCart: ', data);
  const variant = data.variants.find((p) => p.sku === sku);
  const navigate = useNavigate();
  const outOfStock = variant.inventory === 0;

  function submit(ev: React.SyntheticEvent) {
    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: { sku },
      }),
    );
    navigate('/checkout/cart');
    ev.preventDefault();
  }

  return (
    <form action="/checkout/cart/add" method="POST" className="c_AddToCart" data-boundary="checkout" onSubmit={submit}>
      <input type="hidden" name="sku" value={sku} />
      <div className="c_AddToCart__information">
        <p>{variant.price} Ø</p>
        {variant.inventory > 0 ? (
          <p className="c_AddToCart__stock c_AddToCart__stock--ok">{variant.inventory} in stock, free shipping</p>
        ) : (
          <p className="c_AddToCart__stock c_AddToCart__stock--empty">out of stock</p>
        )}
      </div>
      <Button disabled={outOfStock} className="c_AddToCart__button" variant="primary">
        add to basket
      </Button>
      <div className="c_AddToCart__confirmed c_AddToCart__confirmed--hidden">
        <p>Tractor was added.</p>
        <Link to="/checkout/cart" className="c_AddToCart__link">
          View in basket.
        </Link>
      </div>
    </form>
  );
};

export default AddToCart;
