import { PageLayout } from '../components/templates';
import { Hero, ContentSection } from '../components/organisms';
import { Heading, Text, Divider, Container } from '../components/atoms';
import { Card } from '../components/molecules';

export const RegionsPage = () => {
  return (
    <PageLayout>
      <Hero
        title="Birding Regions"
        subtitle="Costa Rica's diverse ecosystems each host unique bird communities"
        size="md"
      />

      <ContentSection containerSize="md">
        <Card variant="bordered">
          <Heading level={3}>Central Highlands & Cloud Forests</Heading>
          <Text color="muted" size="sm" className="mb-4">Monteverde, San Gerardo de Dota, Cerro de la Muerte</Text>
          <Text>
            The misty cloud forests of Costa Rica's central mountains harbor some of the country's
            most sought-after species. Resplendent Quetzals, Three-wattled Bellbirds, and Black Guans
            inhabit these high-elevation forests. The constant moisture and unique ecosystem support
            numerous hummingbird species and endemic birds found nowhere else.
          </Text>
        </Card>

        <Divider />

        <Card variant="bordered">
          <Heading level={3}>Caribbean Lowlands</Heading>
          <Text color="muted" size="sm" className="mb-4">Tortuguero, Sarapiquí, Braulio Carrillo</Text>
          <Text>
            Humid rainforests characterize the Caribbean slope, receiving rainfall throughout the year.
            Great Green Macaws, Keel-billed Toucans, and Snowcaps are among the specialties. The region's
            extensive river systems and wetlands attract waterbirds, while the dense forests shelter
            tinamous, antbirds, and woodcreepers.
          </Text>
        </Card>

        <Divider />

        <Card variant="bordered">
          <Heading level={3}>Pacific Lowlands</Heading>
          <Text color="muted" size="sm" className="mb-4">Carara, Osa Peninsula, Corcovado</Text>
          <Text>
            The Pacific coast transitions from dry forests in the north to humid rainforests in the south.
            Scarlet Macaws thrive in Carara and the Osa Peninsula. Mangrove systems host egrets, herons,
            and kingfishers, while the rainforests of Corcovado support incredible diversity including
            Fiery-billed Aracaris and Baird's Trogons.
          </Text>
        </Card>

        <Divider />

        <Card variant="bordered">
          <Heading level={3}>Northern Pacific & Guanacaste</Heading>
          <Text color="muted" size="sm" className="mb-4">Guanacaste, Palo Verde, Santa Rosa</Text>
          <Text>
            Tropical dry forests dominate northwestern Costa Rica, with distinct wet and dry seasons.
            White-throated Magpie-Jays, Long-tailed Manakins, and Turquoise-browed Motmots characterize
            this region. Seasonal wetlands at Palo Verde attract enormous concentrations of waterbirds
            during the dry season.
          </Text>
        </Card>
      </ContentSection>

      <Container size="md" className="content-section">
        <Heading level={2}>Planning Your Visit</Heading>
        <Text>
          Different regions peak at different times of year. The dry season (December-April) offers
          easier access to many areas, while the green season (May-November) brings breeding activity
          and lush vegetation. Hiring local guides significantly enhances birding success, as they
          know current locations of key species and can identify birds by call.
        </Text>
      </Container>
    </PageLayout>
  );
};
