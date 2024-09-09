import * as React from 'react';
import CompactHeader from './components/CompactHeader';
import Button from './components/Button';
import { useNavigate } from 'react-router-dom';
import './css/Checkout.css';

const StorePicker = React.lazy(() => import('tractor_v2_explore/StorePicker'));
const Footer = React.lazy(() => import('tractor_v2_explore/Footer'));

function useShop() {
  const [shop, setShop] = React.useState('');

  React.useEffect(() => {
    const changeShop = (ev: CustomEvent) => {
      const { shop } = ev.detail;
      setShop(shop);
    };
    window.addEventListener('selected-shop', changeShop);

    return () => {
      window.removeEventListener('selected-shop', changeShop);
    };
  }, []);

  return shop;
}

const defaultForm = {
  firstName: '',
  lastName: '',
};

const Checkout: React.FC = () => {
  const shop = useShop();
  const [data, setData] = React.useState(defaultForm);
  const navigate = useNavigate();
  const isInvalid = !shop || !data.firstName || !data.lastName;

  function changeData(ev: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = ev.currentTarget;
    setData({
      ...data,
      [name]: value,
    });
  }

  function submit(ev: React.SyntheticEvent) {
    window.dispatchEvent(new CustomEvent('clear-cart'));
    navigate('/checkout/thanks');
    ev.preventDefault();
  }

  return (
    <div data-boundary-page="checkout">
      <CompactHeader />
      <main className="c_Checkout">
        <h2>Checkout</h2>
        <form action="/checkout/place-order" method="post" className="c_Checkout__form" onSubmit={submit}>
          <h3>Personal Data</h3>
          <fieldset className="c_Checkout__name">
            <div>
              <label className="c_Checkout__label" htmlFor="c_firstname">
                First name
              </label>
              <input
                className="c_Checkout__input"
                type="text"
                id="c_firstname"
                name="firstName"
                required
                value={data.firstName}
                onChange={changeData}
              />
            </div>
            <div>
              <label className="c_Checkout__label" htmlFor="c_lastname">
                Last name
              </label>
              <input
                className="c_Checkout__input"
                type="text"
                id="c_lastname"
                name="lastName"
                required
                value={data.lastName}
                onChange={changeData}
              />
            </div>
          </fieldset>

          <h3>Store Pickup</h3>
          <fieldset>
            <div className="c_Checkout__store">
              <StorePicker />
            </div>
            <label className="c_Checkout__label" htmlFor="c_storeId">
              Store ID
            </label>
            <input
              className="c_Checkout__input"
              type="text"
              id="c_storeId"
              name="storeId"
              value={shop}
              readOnly
              required
            />
          </fieldset>

          <div className="c_Checkout__buttons">
            <Button type="submit" variant="primary" disabled={isInvalid}>
              place order
            </Button>
            <Button href="/checkout/cart" variant="secondary">
              back to cart
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
