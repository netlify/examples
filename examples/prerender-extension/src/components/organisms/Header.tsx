import { Container } from '../atoms';
import { NavLink } from '../molecules';

export const Header = () => {
  return (
    <header className="header">
      <Container size="lg">
        <div className="header-inner">
          <NavLink to="/" className="header-logo">
            Birds of Costa Rica
          </NavLink>
          <nav className="header-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/regions">Regions</NavLink>
          </nav>
        </div>
      </Container>
    </header>
  );
};
