import { promises as fs } from 'fs';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
  const file = await fs.readFile(process.cwd() + '/public/content/profileData.json', 'utf8');
  const cv = JSON.parse(file);

  // Filter for Projects and Open Source Work
  const projectsAndOSS = cv.allCollections.filter((collection: any) =>
    ["Projects", "Open Source Work"].includes(collection.name)
  );

  return <ProjectsClient collections={projectsAndOSS} />;
}
