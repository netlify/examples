import { PageLayout } from '../components/templates';
import { Hero, BirdGrid, ContentSection } from '../components/organisms';
import { Text } from '../components/atoms';
import { birds } from '../data/birds';

export const HomePage = () => {
  return (
    <PageLayout>
      <Hero
        title="Birds of Costa Rica"
        subtitle="Discover the incredible diversity of avian species in one of the world's premier birdwatching destinations"
        size="lg"
      />

      <ContentSection containerSize="md">
        <Text>
          Costa Rica, despite covering only 0.03% of Earth's surface, is home to more than 900 bird species.
          This remarkable diversity stems from the country's unique position bridging North and South America,
          its varied topography ranging from coastal mangroves to cloud forests, and its commitment to
          environmental conservation.
        </Text>
        <Text className="mt-4">
          Whether you're seeking the resplendent quetzal in misty cloud forests, scarlet macaws along the
          Pacific coast, or the hundreds of hummingbird species found throughout the country, Costa Rica
          offers unparalleled opportunities for bird enthusiasts and nature lovers.
        </Text>
      </ContentSection>

      <ContentSection title="Bird Species Guide" containerSize="lg">
        <BirdGrid birds={birds} columns={3} />
      </ContentSection>
    </PageLayout>
  );
};
