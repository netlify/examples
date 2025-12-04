import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageLayout } from '../components/templates';
import { Hero, ContentSection } from '../components/organisms';
import { Container, Text, Heading } from '../components/atoms';
import { FactList } from '../components/molecules';
import { useMarkdown } from '../hooks/useMarkdown';
import { birds } from '../data/birds';
import { getNetlifyImageUrl } from '../utils/image';

export const BirdDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const bird = birds.find(b => b.slug === slug);
  const { content, loading } = useMarkdown(slug || '');

  if (!bird) {
    return (
      <PageLayout>
        <Hero title="Bird Not Found" size="sm" />
        <ContentSection>
          <Text>The bird you're looking for doesn't exist.</Text>
        </ContentSection>
      </PageLayout>
    );
  }

  // Vary layout based on bird index
  const birdIndex = birds.indexOf(bird);
  const layoutVariant = birdIndex % 3;

  if (loading) {
    return (
      <PageLayout>
        <Hero title={bird.name} subtitle={bird.scientificName} size="sm" />
        <ContentSection>
          <Text>Loading...</Text>
        </ContentSection>
      </PageLayout>
    );
  }

  // Layout Variant 1: Hero with facts sidebar
  if (layoutVariant === 0) {
    return (
      <PageLayout>
        <Hero title={bird.name} subtitle={bird.scientificName} size="md" />

        <Container size="lg" className="content-section">
          <img
            src={getNetlifyImageUrl(bird.imageUrl, { width: 1200, height: 600, fit: 'cover' })}
            alt={bird.name}
            style={{ width: '100%', marginBottom: 'var(--space-xl)' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-xl)' }}>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
            <aside>
              <Heading level={4}>Quick Facts</Heading>
              <FactList
                facts={[
                  { label: 'Family', value: bird.family },
                  { label: 'Size', value: bird.size },
                  { label: 'Diet', value: bird.diet },
                  { label: 'Status', value: bird.conservation },
                  { label: 'Habitat', value: bird.habitat.join(', ') }
                ]}
              />
            </aside>
          </div>
        </Container>
      </PageLayout>
    );
  }

  // Layout Variant 2: Compact hero with facts at top
  if (layoutVariant === 1) {
    return (
      <PageLayout>
        <Hero title={bird.name} subtitle={bird.scientificName} size="sm" />

        <ContentSection containerSize="md">
          <img
            src={getNetlifyImageUrl(bird.imageUrl, { width: 900, height: 500, fit: 'cover' })}
            alt={bird.name}
            style={{ width: '100%', marginBottom: 'var(--space-lg)' }}
          />
          <FactList
            facts={[
              { label: 'Scientific Name', value: bird.scientificName },
              { label: 'Family', value: bird.family },
              { label: 'Size', value: bird.size },
              { label: 'Diet', value: bird.diet },
              { label: 'Conservation', value: bird.conservation },
              { label: 'Primary Regions', value: bird.region.join(', ') }
            ]}
          />
        </ContentSection>

        <ContentSection containerSize="md">
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </ContentSection>
      </PageLayout>
    );
  }

  // Layout Variant 3: Large hero with minimal facts
  return (
    <PageLayout>
      <Hero title={bird.name} subtitle={bird.scientificName} size="lg">
        <Text size="lg" className="mt-4">{bird.excerpt}</Text>
      </Hero>

      <Container size="md" className="content-section">
        <img
          src={getNetlifyImageUrl(bird.imageUrl, { width: 900, height: 600, fit: 'cover' })}
          alt={bird.name}
          style={{ width: '100%', marginBottom: 'var(--space-xl)' }}
        />
      </Container>

      <ContentSection containerSize="sm">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-xl)',
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div>
            <Text size="sm" color="muted">Family</Text>
            <Text weight="medium">{bird.family}</Text>
          </div>
          <div>
            <Text size="sm" color="muted">Size</Text>
            <Text weight="medium">{bird.size}</Text>
          </div>
          <div>
            <Text size="sm" color="muted">Conservation</Text>
            <Text weight="medium">{bird.conservation}</Text>
          </div>
        </div>

        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </ContentSection>
    </PageLayout>
  );
};
