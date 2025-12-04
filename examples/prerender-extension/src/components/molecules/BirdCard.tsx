import { Link, Heading, Text } from '../atoms';
import { getNetlifyImageUrl } from '../../utils/image';

interface BirdCardProps {
  name: string;
  scientificName: string;
  slug: string;
  imageUrl?: string;
  excerpt?: string;
}

export const BirdCard = ({ name, scientificName, slug, imageUrl, excerpt }: BirdCardProps) => {
  return (
    <Link to={`/birds/${slug}`} className="bird-card">
      {imageUrl && (
        <div className="bird-card-image">
          <img
            src={getNetlifyImageUrl(imageUrl, { width: 600, height: 450, fit: 'cover' })}
            alt={name}
            loading="lazy"
          />
        </div>
      )}
      <div className="bird-card-content">
        <Heading level={3} className="bird-card-title">{name}</Heading>
        <Text size="sm" color="muted" className="bird-card-scientific">{scientificName}</Text>
        {excerpt && <Text size="sm" className="bird-card-excerpt">{excerpt}</Text>}
      </div>
    </Link>
  );
};
