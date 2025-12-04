import { Container, Text } from '../atoms';

export const Footer = () => {
  return (
    <footer className="footer">
      <Container size="lg">
        <Text size="sm" color="muted" className="footer-text">
          Educational resource for bird enthusiasts and researchers
        </Text>
      </Container>
    </footer>
  );
};
