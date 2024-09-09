import * as React from 'react';
import { src, srcset } from '../js/utils';
 
interface StoreProps {
  image: string;
  street: string;
  name: string;
  city: string;
}

export default ({ name, image, street, city }: StoreProps) => {
  return (
    <li className="e_Store">
      <div className="e_Store_content">
        <img className="e_Store_image" src={src(image, 200)} srcSet={srcset(image, [200, 400])} width="200" height="200" />
        <p className="e_Store_address">
          {name}
          <br />
          {street}
          <br />
          {city}
        </p>
      </div>
    </li>
  );
};
