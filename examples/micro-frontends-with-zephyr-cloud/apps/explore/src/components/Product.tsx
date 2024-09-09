import * as React from 'react';
import { Link } from 'react-router-dom';
import { src, srcset, fmtprice } from '../js/utils';
import '../css/Product.css';

interface ProductProps {
  name: string;
  url: string;
  image: string;
  startPrice: number;
}

export default ({ name, url, image, startPrice }: ProductProps) => {
  return (
    <li className="e_Product">
      <Link className="e_Product_link" to={url}>
        <img
          className="e_Product_image"
          src={src(image, 200)}
          srcSet={srcset(image, [200, 400, 800])}
          sizes="300px"
          width="200"
          height="200"
        />
        <span className="e_Product_name">{name}</span>
        <span className="e_Product_price">{fmtprice(startPrice)}</span>
      </Link>
    </li>
  );
};
