import * as React from 'react';
import { Link } from 'react-router-dom';
import '../css/Filter.css';

interface FilterProps {
  filters: Array<{
    active?: boolean;
    name: string;
    url: string;
  }>;
}

export default ({ filters }: FilterProps) => {
  return (
    <div className="e_Filter">
      Filter:
      <ul>
        {filters.map((f, i) =>
          f.active ? (
            <li key={i} className="e_Filter__filter--active">
              {f.name}
            </li>
          ) : (
            <li key={i}>
              <Link to={f.url}>{f.name}</Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};
