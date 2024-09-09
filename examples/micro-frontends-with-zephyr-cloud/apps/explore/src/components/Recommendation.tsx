import * as React from 'react';
import { Link } from 'react-router-dom';
import { src, srcset } from '../js/utils';
import '../css/Recommendation.css';

interface RecommendationProps {
  image: string;
  url: string;
  name: string;
}

export default ({ image, url, name }: RecommendationProps) => {
  return (
    <li className="e_Recommendation">
      <Link className="e_Recommendation_link" to={url}>
        <img
          className="e_Recommendation_image"
          src={src(image, 200)}
          srcSet={srcset(image, [200, 400])}
          alt=""
          sizes="200px"
          width="200"
          height="200"
        />
        <span className="e_Recommendation_name">{name}</span>
      </Link>
    </li>
  );
};
