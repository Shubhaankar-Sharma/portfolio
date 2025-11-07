import { promises as fs } from 'fs';
import path from 'path';
import Profile from '../Profile';

export const metadata = {
  title: 'CV - Shubhaankar Sharma',
  description: 'CV of Shubhaankar Sharma - Systems Research, Distributed Systems, Databases',
};

export default async function CVPage() {
  const filePath = path.join(process.cwd(), 'public', 'content', 'profileData.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const cv = JSON.parse(fileContents);

  // Remove the about section for CV view
  const cvData = {
    ...cv,
    general: {
      ...cv.general,
      about: null
    }
  };

  return <Profile cv={cvData} />;
}
