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
        return ['home', 'hacking', 'about me', 'contact'];
      case '/hacking':
        return ['home', 'career', 'about me', 'contact'];
      case '/about':
        return ['home', 'career', 'hacking', 'contact'];
      case '/contact':
        return ['home', 'career', 'hacking', 'about me'];
      default:
        return ['home', 'career', 'hacking', 'contact'];
    }
  };

  // Get paths for links
  const getPath = (link: string) => {
    switch (link) {
      case 'home':
        return '/';
      case 'about me':
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
    <footer className="fixed bottom-4 left-0 right-0 z-20 px-16">
      <div className="flex justify-between max-w-[1920px] mx-auto">
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