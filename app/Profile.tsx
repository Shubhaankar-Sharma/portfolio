import Image from "next/image";
import RichText from "./RichText";
import Arrow12 from "./Arrow12";
import styles from "./Profile.module.css";
import Attachments from "./Attachments";

type ProfileProps = {
  cv: any,
};
const Profile: React.FC<ProfileProps> = ({
  cv
}) => {
  return (
    <div className={styles.profile}>
      <div className={styles.profileHeader}>
        <div className={styles.profilePhoto}>
          <Image src={cv.general.profilePhoto} alt="" width={92} height={92} />
        </div>
        <div className={styles.profileInfo}>
          <h1>{cv.general.displayName}</h1>
          <div className={styles.byline}>{cv.general.byline}</div>
          {cv.general.website ?
            <a className={styles.website}>{cv.general.website}</a>
          : null}
        </div>
      </div>

      {cv.general.about ?
        <section className={`${styles.profileSection} ${styles.about}`}>
          <h3>About</h3>
          <div className={styles.description}>
            <RichText text={cv.general.about}/>
          </div>
        </section>
      : null}

      {cv.allCollections.map((collection: any, index: number) => {
        // Different colors for different sections
        let sectionSquiggleClass = "squiggle-blue"; // default
        if (collection.name === "Work Experience") sectionSquiggleClass = "squiggle-blue";
        else if (collection.name === "Education") sectionSquiggleClass = "squiggle-purple";
        else if (collection.name === "Papers") sectionSquiggleClass = "squiggle-cyan";
        else if (collection.name === "Open Source Work") sectionSquiggleClass = "squiggle-green";
        else if (collection.name === "Projects") sectionSquiggleClass = "squiggle-orange";
        else if (collection.name === "Awards") sectionSquiggleClass = "squiggle-red";
        else if (collection.name === "Links") sectionSquiggleClass = "squiggle-blue";
        
        return (
          <section key={collection.name} className={styles.profileSection}>
            <h3 className={sectionSquiggleClass}>{collection.name}</h3>
            <div className={collection.name === "Links" ? styles.contacts : styles.experiences}>
              {collection.items.map((experience: any, itemIndex: number) => {

                if (collection.name === "Links") {
                  return <ContactItem key={experience.id || experience.url || itemIndex} experience={experience}/>
                }

                return (
                  <ProfileItem key={experience.id || experience.heading || itemIndex} experience={experience}/>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  );
};

type ProfileItemProps = {
  experience: any,
};
const ProfileItem: React.FC<ProfileItemProps> = ({
  experience
}) => {

  let title;
  if (experience.url) {
    title = <>
      <a href={experience.url} target="_blank">{experience.heading}</a><span className={styles.linkArrow}>&#xfeff;<Arrow12 fill="var(--grey1)"/></span>
    </>
  } else {
    title = experience.heading
  }
  return (
    <div className={styles.experience}>
      <div className={styles.year}>
        {experience.year}
      </div>
      <div className={styles.experienceContent}>
        <div className={styles.titleRow}>
          <div className={styles.title}>
            {title}
          </div>
        </div>
        {experience.location ?
        <div className={styles.location}>{experience.location}</div>
        : null}
        {experience.institution ?
        <div className={styles.location}>{experience.institution}</div>
        : null}
        {experience.description ?
        <div className={styles.description}>
          <RichText text={experience.description}/>
        </div>
        : null}
        {experience.technologies && experience.technologies.length > 0 ?
        <div className={styles.technologies}>
          {experience.technologies.map((tech: string, index: number) => (
            <span key={index} className={styles.technology}>{tech}</span>
          ))}
        </div>
        : null}
        {experience.attachments && experience.attachments.length > 0 ?
          <Attachments attachments={experience.attachments}/>
        : null}
      </div>
      {experience.logo ?
        <div className={styles.logo}>
          <Image src={experience.logo} alt="" width={32} height={32} />
        </div>
      : <div></div>}
    </div>
  )
}

type ContactItemProps = {
  experience: any,
};
const ContactItem: React.FC<ContactItemProps> = ({
  experience
}) => {
  // Different colors for different contact types
  let squiggleClass = "squiggle-blue"; // default
  if (experience.platform === "GitHub") squiggleClass = "squiggle-purple";
  else if (experience.platform === "Email") squiggleClass = "squiggle-red";
  else if (experience.platform === "LinkedIn") squiggleClass = "squiggle-blue";
  else if (experience.platform === "Resume") squiggleClass = "squiggle-orange";
  else if (experience.platform === "X") squiggleClass = "squiggle-purple";
  else if (experience.platform === "Notes") squiggleClass = "squiggle-green";
  else if (experience.platform === "Photography") squiggleClass = "squiggle-purple";
  
  return (
    <div className={styles.experience}>
      <div className={styles.year}>
        <span>{experience.platform}</span>
      </div>
      <div className={styles.experienceContent}>
        <div className={styles.title}>
          <a href={experience.url} target="_blank" className={squiggleClass}>{experience.handle}</a><span className={styles.linkArrow}>&#xfeff;<Arrow12 fill="var(--grey1)"/></span>
        </div>
      </div>
    </div>
  )
}

export default Profile;
