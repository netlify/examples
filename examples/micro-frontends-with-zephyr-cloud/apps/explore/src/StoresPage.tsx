import * as React from 'react';
import data from './data/db.json';
import Store from './components/Store';
import Header from './Header';
import Footer from './Footer';
import './css/StoresPage.css';

const StoresPage: React.FC = () => {
  return (
    <div data-boundary-page="explore">
      <Header />
      <main className="e_StoresPage">
        <h2>Our Stores</h2>
        <p>
          Want to see our products in person? Visit one of our stores to see our products up close and talk to our
          experts. We have stores in the following locations:
        </p>
        <ul className="e_StoresPage_list">
          {data.stores.map((store, i) => (
            <Store key={i} {...store} />
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default StoresPage;
