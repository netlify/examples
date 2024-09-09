import * as React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="e_Footer" data-boundary="explore">
      <div className="e_Footer__cutter">
        <div className="e_Footer__inner">
          <div className="e_Footer__initiative">
            <img
              src="https://blueprint.the-tractor.store/cdn/img/neulandlogo.svg"
              alt="neuland - Büro für Informatik"
              width="45"
              height="40"
            />
            <p>
              based on{' '}
              <a href="https://micro-frontends.org/tractor-store/" target="_blank">
                the tractor store 2.0
              </a>
              <br />a{' '}
              <a href="https://neuland-bfi.de" target="_blank">
                neuland
              </a>{' '}
              project
            </p>
          </div>

          <div className="e_Footer__credits">
            <h3>techstack</h3>
            <p>SPA, Piral, React, esbuild</p>
            <p>
              build by <img src="https://piral.io/logo-simple.f8667084.png" alt="Piral" width="14" height="14" />
              <a href="https://www.piral.io" target="_blank">
                Piral
              </a>{' '}
              /{' '}
              <a href="https://github.com/piral-samples/tractor-v2" target="_blank">
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
