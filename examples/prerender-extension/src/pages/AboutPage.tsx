import { PageLayout } from '../components/templates';
import { Hero, ContentSection } from '../components/organisms';
import { Heading, Text, Divider } from '../components/atoms';

export const AboutPage = () => {
  return (
    <PageLayout>
      <Hero
        title="About This Project"
        subtitle="An educational resource for bird enthusiasts and researchers"
        size="md"
      />

      <ContentSection containerSize="sm">
        <Heading level={2}>Mission</Heading>
        <Text>
          This educational platform serves as a comprehensive resource for understanding the
          remarkable avian biodiversity of Costa Rica. Our goal is to provide accurate,
          accessible information about the country's bird species to support conservation
          efforts and promote responsible ecotourism.
        </Text>

        <Divider />

        <Heading level={2}>Costa Rica's Avian Diversity</Heading>
        <Text>
          With over 900 recorded bird species, Costa Rica represents one of the world's most
          important birding destinations. This diversity results from several key factors:
        </Text>
        <Text>
          The country's position between North and South America creates a meeting point for
          species from both continents. Dramatic elevation changes, from sea level to peaks
          above 3,800 meters, create distinct habitats supporting different bird communities.
          Multiple climate zones, from dry forests to rainforests to cloud forests, each harbor
          unique species.
        </Text>

        <Divider />

        <Heading level={2}>Conservation</Heading>
        <Text>
          Costa Rica has protected approximately 25% of its territory through national parks,
          biological reserves, and wildlife refuges. This commitment to conservation has made
          the country a model for environmental protection globally. Many bird species that
          have declined elsewhere in Central America maintain healthy populations in Costa Rica's
          protected areas.
        </Text>

        <Divider />

        <Heading level={2}>Using This Resource</Heading>
        <Text>
          Each species profile includes information about identification, habitat, behavior,
          conservation status, and where to observe the species in Costa Rica. This information
          is compiled from field guides, scientific literature, and observations by experienced
          birders and ornithologists.
        </Text>
      </ContentSection>
    </PageLayout>
  );
};
