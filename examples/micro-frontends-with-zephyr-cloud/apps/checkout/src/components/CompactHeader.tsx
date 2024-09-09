import * as React from 'react';
import { Link } from 'react-router-dom';
import '../css/CompactHeader.css';

export default () => {
  return (
    <header className="c_CompactHeader">
      <div className="c_CompactHeader__inner">
        <Link className="c_CompactHeader__link" to="/">
          <img
            className="c_CompactHeader__logo"
            src="https://blueprint.the-tractor.store/cdn/img/logo.svg"
            alt="Micro Frontends - Tractor Store"
          />
        </Link>
      </div>
    </header>
  );
};
