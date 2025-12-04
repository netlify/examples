import { BirdCard } from '../molecules';

interface Bird {
  name: string;
  scientificName: string;
  slug: string;
  imageUrl?: string;
  excerpt?: string;
}

interface BirdGridProps {
  birds: Bird[];
  columns?: 2 | 3 | 4;
}

export const BirdGrid = ({ birds, columns = 3 }: BirdGridProps) => {
  const columnClasses = {
    2: 'bird-grid-2',
    3: 'bird-grid-3',
    4: 'bird-grid-4'
  };

  return (
    <div className={`bird-grid ${columnClasses[columns]}`}>
      {birds.map((bird) => (
        <BirdCard key={bird.slug} {...bird} />
      ))}
    </div>
  );
};
