import { Container, Heading } from '../atoms';
import type { ReactNode } from 'react';

interface ContentSectionProps {
  title?: string;
  children: ReactNode;
  containerSize?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const ContentSection = ({
  title,
  children,
  containerSize = 'md',
  className = ''
}: ContentSectionProps) => {
  return (
    <section className={`content-section ${className}`}>
      <Container size={containerSize}>
        {title && <Heading level={2} className="section-title">{title}</Heading>}
        <div className="section-content">
          {children}
        </div>
      </Container>
    </section>
  );
};
