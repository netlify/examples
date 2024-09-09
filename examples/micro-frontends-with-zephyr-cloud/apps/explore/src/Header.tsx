import * as React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import './css/Header.css';

// const MiniCart = React.lazy(() => import('tractor_v2_checkout/MiniCart'));

const Header = () => {
  return (
    <header className="e_Header" data-boundary="explore">
      <div className="e_Header__cutter">
        <div className="e_Header__inner">
          <Link className="e_Header__link" to="/">
            <img
              className="e_Header__logo"
              src="https://blueprint.the-tractor.store/cdn/img/logo.svg"
              alt="Micro Frontends - Tractor Store"
            />
          </Link>
          <div className="e_Header__navigation">
            <Navigation />
          </div>
          <div className="e_Header__cart">
            {/* <MiniCart /> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
