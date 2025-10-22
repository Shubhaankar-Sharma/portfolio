import styles from "./page.module.css";
import { promises as fs } from 'fs';
import Profile from "./Profile";
import Navigation from "./Navigation";

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/public/content/profileData.json', 'utf8');
  const cv = JSON.parse(file);

  // Build section IDs for navigation
  const sections = ["about"];
  cv.allCollections.forEach((collection: any) => {
    const sectionId = collection.name.toLowerCase().replace(/\s+/g, '-');
    sections.push(sectionId);
  });

  return (
    <div className={styles.page}>
      <Profile cv={cv} />
      <Navigation sections={sections} />
    </div>
  );
}
