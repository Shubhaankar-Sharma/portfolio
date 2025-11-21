import Image from "next/image";
import RichText from "./RichText";
import Arrow12 from "./Arrow12";
import Attachments from "./Attachments";
import styles from "./Profile.module.css";

type ProfileProps = {
  cv: any,
};

const Profile: React.FC<ProfileProps> = ({ cv }) => {
  return (
    <div className={styles.profile}>
      {/* Simple header */}
      <header className={styles.header}>
        <h1>{cv.general.displayName}</h1>
        <p className={styles.byline}>{cv.general.byline}</p>
      </header>

      {/* About */}
      <section id="about" className={styles.section}>
        <h2 className={styles.sectionTitle}>About</h2>
        <div className={styles.aboutContent}>
          <ul>
            <li>I spend most of my time learning more about systems - distributed systems, databases, real time systems</li>
            <li>I love working on problems that seem really intriguing and impactful</li>
            <li>I am a bit obsessed with music, I listen to all genres, but I love blues, punk, alt, indie jazz, sufi and indian folk music</li>
            <li>Right now I'm researching probabilistic guarantees in concurrency testing and exploring how GPU parallelism affects real-time systems</li>
          </ul>
        </div>
      </section>

      {/* Sitemap */}
      <section id="sitemap" className={styles.section}>
        <h2 className={styles.sectionTitle}>Sitemap</h2>
        <div className={styles.sitemap}>
          <a href="/reading" className={styles.sitemapLink}>Reading & Writing</a>
          <a href="/projects" className={styles.sitemapLink}>Projects & Open Source</a>
        </div>
      </section>

      {/* Render all collections except Projects and Open Source Work */}
      {cv.allCollections
        .filter((collection: any) =>
          !["Projects", "Open Source Work"].includes(collection.name)
        )
        .map((collection: any) => {
        const sectionId = collection.name.toLowerCase().replace(/\s+/g, '-');

        return (
          <section key={collection.name} id={sectionId} className={styles.section}>
            <h2 className={styles.sectionTitle}>{collection.name}</h2>

            <div className={styles.items}>
              {collection.items.map((item: any, idx: number) => {
                if (collection.name === "Links") {
                  return (
                    <a
                      key={item.id || idx}
                      href={item.url}
                      target="_blank"
                      className={styles.contactLink}
                      {...(item.rel && { rel: item.rel })}
                    >
                      <span className={styles.contactPlatform}>{item.platform}</span>
                      <span className={styles.contactHandle}>{item.handle}</span>
                    </a>
                  );
                }

                return (
                  <div key={item.id || idx} className={styles.item}>
                    <div className={styles.itemMeta}>
                      {item.year}
                    </div>
                    <div className={styles.itemContent}>
                      {item.logo && (
                        <div className={styles.itemLogo}>
                          <Image src={item.logo} alt="" width={40} height={40} />
                        </div>
                      )}
                      <div className={styles.itemMain}>
                        <div className={styles.itemHeader}>
                          {item.url ? (
                            <a href={item.url} target="_blank" className={styles.itemTitle}>
                              {item.heading || item.title}
                            </a>
                          ) : (
                            <h3 className={styles.itemTitle}>{item.heading || item.title}</h3>
                          )}
                        </div>

                        {(item.company || item.institution || item.location) && (
                          <div className={styles.itemSubtitle}>
                            {item.company || item.institution}
                            {item.location && <span className={styles.location}> · {item.location}</span>}
                          </div>
                        )}

                        {item.description && (
                          <div className={styles.itemDescription}>
                            <RichText text={item.description} />
                          </div>
                        )}

                        {item.technologies && item.technologies.length > 0 && collection.name !== "Experience" && (
                          <div className={styles.technologies}>
                            {item.technologies.map((tech: string, i: number) => (
                              <span key={i} className={styles.tech}>{tech}</span>
                            ))}
                          </div>
                        )}

                        {item.attachments && item.attachments.length > 0 && (
                          <div className={styles.attachments}>
                            <Attachments attachments={item.attachments} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Profile;
