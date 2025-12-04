import { Container, Heading, Text } from '../atoms';
import type { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Hero = ({ title, subtitle, children, size = 'md' }: HeroProps) => {
  const sizeClasses = {
    sm: 'hero-sm',
    md: 'hero-md',
    lg: 'hero-lg'
  };

  return (
    <section className={`hero ${sizeClasses[size]}`}>
      <Container size="md">
        <Heading level={1} className="hero-title">{title}</Heading>
        {subtitle && <Text size="lg" className="hero-subtitle">{subtitle}</Text>}
        {children}
      </Container>
    </section>
  );
};
