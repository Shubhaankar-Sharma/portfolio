import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <p className="text-2xl mb-8 text-center">
        WIP... stuff about my inspiration... my love for music, sitcoms,
        stratocasters... some philosophy... things I found interesting...
        travel... pictures
      </p>
      <div className="flex space-x-4 mt-8">
        <a
          href="https://github.com/Shubhaankar-Sharma"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link hover:opacity-80"
        >
          <FaGithub size={32} />
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link hover:opacity-80"
        >
          <FaTwitter size={32} />
        </a>
        <a
          href="mailto:shubhaankar@hotmail.com"
          className="text-link hover:opacity-80"
        >
          <FaEnvelope size={32} />
        </a>
      </div>
    </div>
  );
};

export default About;
