// src/components/Footer.tsx
import { Link, useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();
  
  // Function to get the four links based on current page
  const getLinks = () => {
    switch (location.pathname) {
      case '/':
        return ['', 'contact'];
      case '/career':
        return ['home', 'contact'];
      case '/hacking':
        return ['home', 'contact'];
      case '/about':
        return ['home', 'contact'];
      default:
        return ['home', 'contact'];
    }
  };

  // Get paths for links
  const getPath = (link: string) => {
    switch (link) {
      case 'home':
        return '/';
      case 'about me':
        return '/about';
      case 'contact':
        return '/about';
      case 'github':
        return 'https://github.com';
      case 'twitter':
        return 'https://twitter.com';
      case 'email':
        return 'mailto:hi@spongeboi.com';
      default:
        return `/${link}`;
    }
  };

  const links = getLinks();

  return (
    <footer className="mt-auto py-4">
      <div className="flex justify-between max-w-[1920px] mx-auto px-16 font-vt323">
        {links.map((link) => (
          <Link
            key={link}
            to={getPath(link)}
            className={`${
              location.pathname === getPath(link) ? 'text-secondary-text' : 'text-link'
            } text-footer`}
          >
            {link}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;