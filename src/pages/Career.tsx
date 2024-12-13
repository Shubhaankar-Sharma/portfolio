import React, { useState, ReactNode } from "react";
import horizonlogo from "../assets/images/horizonlogo.png";
import ubclogo from "../assets/images/ubclogo.png";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  extraContent?: ReactNode;
  logo?: string;
  startDate: string;
  endDate?: string;
  children?: ReactNode;
  url: string;
}

interface DropdownProps {
  label: string;
  children: ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  subtitle,
  extraContent,
  logo,
  startDate,
  endDate,
  children,
  url,
}) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-2">
        <div>
          <a href={url} className="text-link hover:underline">
            <h3 className="text-2xl flex items-center gap-4">
              {title}
              <span className="hidden sm:block">
                {logo && (
                  <img
                    src={logo}
                    alt={`${title} logo`}
                    className="w-8 h-8 object-contain"
                  />
                )}
              </span>
            </h3>
          </a>
          <p className="text-lg text-secondary-text block sm:hidden">
            {startDate} - {endDate}
          </p>
          <p className="text-xl text-secondary-text">{subtitle}</p>
          {extraContent}
        </div>
        <div className="text-xl text-secondary-text">
          <span className="hidden sm:block">
            {startDate} - {endDate}
          </span>
          <span className="block sm:hidden">
            {logo && (
              <img
                src={logo}
                alt={`${title} logo`}
                className="w-8 h-8 object-contain"
              />
            )}
          </span>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};

interface CourseProps {
  title: string;
  courseCode: string;
  description: string;
  instructor?: string;
}

const Course: React.FC<CourseProps> = ({
  title,
  courseCode,
  description,
  instructor,
}) => {
  return (
    <div className="mb-4">
      <p className="text-xl">
        {title} ({courseCode})
      </p>
      <div className="pl-4 text-secondary-text">
        <p className="text-lg">{description}</p>
        {instructor && (
          <p className="text-lg text-secondary-text">
            Instructor: {instructor}
          </p>
        )}
      </div>
    </div>
  );
};

interface CourseListProps {
  courses: Map<string, CourseProps[]>;
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <div className="space-y-4 text-xl">
      {Array.from(courses.entries()).map(([department, courseList]) => (
        <Dropdown key={department} label={department}>
          {courseList.map((course) => (
            <Course key={course.courseCode} {...course} />
          ))}
        </Dropdown>
      ))}
    </div>
  );
};

const courses: Map<string, CourseProps[]> = new Map([
  [
    "Computer Science",
    [
      {
        title: "Computation, Programs, and Programming",
        courseCode: "CPSC 110",
        description:
          "Learnt about Systemic Program Design Methadology in Racket a LISPy language, also applied data-driven design principles to systematically break down complex problems into manageable and readable components. Also focused a lot on Test Driven Development.",
        instructor: "Gregor Kiczales",
      },
      {
        title: "Models of Computation",
        courseCode: "CPSC 121",
        description:
          "Developed strong foundations in discrete mathematics and logic, and learnt a lot about digital logic design principles, including the implementation of combinational and sequential circuits using gates, multiplexers, flip-flops, and registers",
        instructor: "Patrice Belleville",
      },
      {
        title: "Software Construction",
        courseCode: "CPSC 210",
        description:
          "Learnt about Object-Oriented Programming and Design, also learnt about design patterns and the importance of software testing. Also developed a java project with gui in swing",
        instructor: "Steve Wolfman",
      },
      {
        title: "Introduction to Computer Systems",
        courseCode: "CPSC 213",
        description:
          "Learnt about the basics of computer systems, including assembly programming, memory hierarchy, atomic operations, and operating system concepts. Also learnt a lot about memory management in C",
        instructor: "Mike Feeley",
      },
      {
        title: "Basic Algorithms and Data Structures",
        courseCode: "CPSC 221",
        description:
          "Learnt about basic algorithms and data structures, including sorting algorithms, binary search trees, hash tables, and graph algorithms. Also learnt about the importance of algorithm analysis",
        instructor: "Vsevolod (Seva) Lynov",
      },
      {
        title: "Introduction to Relational Databases",
        courseCode: "CPSC 304",
        description:
          "Learnt about relational databases, including SQL, database design, and normalization. Also developed a project using a relational database",
        instructor: "Raymond Ng",
      },
      {
        title: "Numerical Computation for Algebraic Problems",
        courseCode: "CPSC 302",
        description:
          "Learnt about the problem associated with numerical computation, how to write efficient algorithms that minimize error, learnt how to write efficient algorithms for solving huge million by million tri-diagonal matrices and other linear algebra problems in julia",
        instructor: "Avleen Kaur",
      },
      {
        title: "Introduction to Software Engineering",
        courseCode: "CPSC 310",
        description:
          "Learnt about software engineering principles, including software requirements, design, testing, and project management. Also developed a huge project where he had to create a custom database and a query language for it using agile methodologies done in group of 2 in typescript",
        instructor: "Nick Bradley",
      },
    ],
  ],
  [
    "Mathematics",
    [
      {
        title: "Differential Calculus with Applications",
        courseCode: "MATH 100",
        description:
          "Learnt about differential calculus, including limits, derivatives, and applications of derivatives. ",
        instructor: "Mark MacLean",
      },
      {
        title: "Integral Calculus with Applications",
        courseCode: "MATH 101",
        description:
          "Learnt about integral calculus, including definite and indefinite integrals, and applications of integrals. ",
        // instructor: "i don't remember",
      },
      {
        title: "Calculus III",
        courseCode: "MATH 200",
        description:
          "Learnt about multivariable calculus, including partial derivatives, gradients, and line integrals.",
      },
      {
        title: "Mathematical Proof",
        courseCode: "MATH 220",
        description:
          "Learnt about mathematical proof techniques, including direct proof, proof by contradiction, and proof by induction. Also learnt about set theory and functions",
      },
      {
        title: "Matrix Algebra",
        courseCode: "MATH 221",
        description:
          "Learnt about matrix algebra, including matrix operations, determinants, and eigenvalues. Also learnt about linear transformations and their applications",
      },
    ],
  ],
  [
    "Electives",
    [
      {
        title: "Introduction to Data Science",
        courseCode: "DSCI 100",
        description:
          "Learnt about data science principles, including data visualization, data wrangling, and machine learning. Also developed a linear regression project around predicting income category based on gender, age, marital status, occupation, and type of employment using KNN",
      },
      {
        title: "Writing and Research in the Sciences",
        courseCode: "WRDS 150",
        description:
          "Learnt about scientific writing principles, including research methods, literature reviews, and scientific communication.",
      },
      {
        title: "Introduction to Modern Biology",
        courseCode: "BIOL 111",
        description:
          "Learnt about modern biology principles, including cell biology, genetics, and evolution.",
      },
      {
        title: "Energy and Waves",
        courseCode: "PHYS 131",
        description:
          "Learnt about energy and wave principles, including thermodynamics, electricity, and magnetism.",
      },
      {
        title: "Experimental Physics Lab I",
        courseCode: "PHYS 119",
        description:
          "Learnt about experimental physics principles, including data collection, analysis, and interpretation.",
      },
      {
        title: "Learning German I",
        courseCode: "GERM 100",
        description:
          "Learnt about basic German language principles, including vocabulary, grammar, and pronunciation.",
      },
      {
        title: "Introduction to Philosophy",
        courseCode: "PHIL 101",
        description:
          "Read philosophies around topics such as the nature and scope of human knowledge, the existence of God, and the relationship between mind and body. Philosophers studied: Socrates, Plato, Aristotle, Descartes, Hume, and Kant.",
      },
    ],
  ],
]);

const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 text-link hover:underline"
        type="button"
      >
        <span>›</span>
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="pl-6 mt-2 text-secondary-text">{children}</div>
      )}
    </div>
  );
};

const Career: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="text-4xl">My Career So Far</h1>
        <a
          href="https://spongeboi.com/resume.pdf"
          className="text-link hover:underline text-xl"
          target="_blank"
        >
          Resume
        </a>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl mb-8">Education</h2>
        <TimelineItem
          title="University of British Columbia"
          subtitle="Bachelor of Science"
          extraContent={
            <p className="text-secondary-text text-xl">
              Computer Science and Mathematics
            </p>
          }
          logo={ubclogo}
          startDate="Sep 2022"
          endDate="Apr 2026"
          url="https://www.ubc.ca/"
        >
          <div className="space-y-4">
            <div>
              <p className="text-secondary-text mb-2">Awards</p>
              <div className="space-y-1 text-xl">
                <div className="flex items-center gap-2">
                  <span className="text-link">›</span>
                  <span>Dean's Honor List (2023)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-link">›</span>
                  <span>Science Scholarship Award (2024)</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-secondary-text mb-2">Courses</p>
              <CourseList courses={courses} />
            </div>
          </div>
        </TimelineItem>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl mb-8">Experience</h2>
        <TimelineItem
          title="Horizon Blockchain Games Inc."
          subtitle="Backend Developer (Part-time)"
          logo={horizonlogo}
          startDate="Sep 2021"
          endDate="Sep 2024"
          url="https://horizon.io/"
        >
          <div className="space-y-4">
            <div>
              <p className="text-secondary-text mb-2">Impact + Projects</p>
              <ul className="list-disc pl-4 text-lg">
                <li>
                  Worked on migrating{" "}
                  <a
                    href="https://sequence.info/"
                    target="_blank"
                    className="text-link hover:underline"
                  >
                    Sequence's
                  </a>{" "}
                  infrastructure to Kubernetes and Pulumi
                </li>
                <li>
                  Shipped a highly scalable search and filtering used in the
                  sequence marketplace that indexes all Collectibles on an EVM
                  blockchain and allows custom filtering using a collection's
                  properties
                </li>
                <li>
                  Wrote and Shipped a webhook notification system that notifies
                  users of custom events happening on all supported EVMs.
                </li>
                <li>
                  Maintained Sequence's metadata service, made it lazily index
                  metadata and handle around 1.5k requests per minute
                </li>
                <li>
                  Worked on{" "}
                  <a
                    href="https://github.com/0xsequence/ethwal/pull/9"
                    target="_blank"
                    className="text-link hover:underline"
                  >
                    ethwal's filter index
                  </a>
                  , this was a very elegant design thought by Marcin Górzyński,
                  which allowed us to store all kinds of custom events from EVMs
                  in bitmaps and perform very complex filtering operations in
                  them to find historical transaction data containing
                  information we need.
                </li>
              </ul>
            </div>
            <div>
              <p className="text-secondary-text mb-2">Some things I learnt</p>
              <ul className="list-disc pl-4 text-lg">
                <li>
                  <strong> Optimizing code for scale: </strong> Working in the
                  Sequence team, I really understood how to see the scale. When
                  writing code for the indexer I never worried about mutex
                  operations, I abused those operations, but Marcin helped me
                  realize that when we have around 7k transactions being
                  processed in each indexer, the amount of overhead such a
                  simple thing would add is a lot. After this I was always
                  really careful about writing code keeping in mind the scale.
                </li>
                <li>
                  <strong>DB Optimization: </strong> I wrote very slow queries,
                  not caring about indexes and how Postgres plans queries which
                  is very un-intuitive. Once a query of mine on the production
                  DB was performing in 2 seconds on my local machine but 1
                  minute on the Kubernetes container in prod - after Maciej
                  debugged, he finally explained how much of a difference a HDD
                  and SSD makes - a simple line change so that Postgres uses the
                  right index and using vectors for searching, made the query
                  perform in a second. This is just one of the many instances I
                  learnt about SQL optimization.
                </li>
                <li>
                  <strong>Project Layout: </strong> Sequence's Go services had a
                  very elegant project layout, it was very easy to navigate the
                  code, and to add a feature you didn't even need to know
                  anything about the codebase, you just had to know where to put
                  the code and how to write tests for it. This was a very good
                  learning experience for me, and I have tried to replicate this
                  in my personal projects.
                </li>
                <li>
                  <strong>Reject Artificial Bounds: </strong>{" "}
                  <a href="https://twitter.com/peterk" target="_blank">
                    Peter Kieltyka
                  </a>
                  , the company's founder and CEO - I was in total awe when I
                  saw that the guy was as deep in tech as any of the developers,
                  familiar with all the different codebases as much as the
                  maintainers of those projects, maintaining huge libraries on
                  github, was still able to manage the company and do everything
                  basically. Similarly I saw many people there who seemed to
                  have supernatural abilities a few of them being{" "}
                  <a href="https://ari.computer/" target="_blank">
                    Ari
                  </a>
                  ,{" "}
                  <a href="https://github.com/c2h5oh" target="_blank">
                    Maciej
                  </a>
                  , <a href="https://github.com/marino39">Marcin</a>. <br />
                  They were just so good at what they did while still being able
                  to do anything thrown at them as good as an expert. <br /> If
                  you form assumptions about what you can and can't do, you are
                  really limiting yourself which seems obvious but its really
                  difficult to not form an image of yourself in your head.
                </li>
              </ul>
            </div>
          </div>
        </TimelineItem>
      </section>
      <section className="mb-16">
        <h2 className="text-3xl mb-8">The Tech I Have Been Using</h2>
        <div className="space-y-4 text-xl">
          <div>
            <h3 className="text-2xl mb-2">Languages</h3>
            <ul className="flex flex-wrap gap-4">
              <li>
                <a
                  href="https://golang.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Golang
                </a>
              </li>
              <li>
                <a
                  href="https://isocpp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  C++
                </a>
              </li>
              <li>
                <a
                  href="https://www.java.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Java
                </a>
              </li>
              <li>
                <a
                  href="https://www.python.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Python
                </a>
              </li>
              <li>
                <a
                  href="https://julialang.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Julia
                </a>
              </li>
              <li>
                <a
                  href="https://www.typescriptlang.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  TypeScript
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl mb-2">Frameworks and Libraries</h3>
            <ul className="flex flex-wrap gap-4">
              <li>
                <a
                  href="https://github.com/go-chi/chi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Chi
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/webrpc/webrpc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  WebRPC
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lib/pq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  lib/pq
                </a>
              </li>
              <li>
                <a
                  href="https://fastapi.tiangolo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  fastAPI
                </a>
              </li>
              <li>
                <a
                  href="https://flutter.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Flutter
                </a>
              </li>
              <li>
                <a
                  href="https://reactjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  React
                </a>
              </li>
              <li>
                <a
                  href="https://expressjs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Express
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Next.js
                </a>
              </li>
              <li>
                <a
                  href="https://pandas.pydata.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Pandas
                </a>
              </li>
              <li>
                <a
                  href="https://numpy.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Numpy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl mb-2">Tools & Infra</h3>
            <ul className="flex flex-wrap gap-4">
              <li>
                <a
                  href="https://kubernetes.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Kubernetes
                </a>
              </li>
              <li>
                <a
                  href="https://www.postgresql.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Postgres
                </a>
              </li>
              <li>
                <a
                  href="https://redis.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Redis
                </a>
              </li>
              <li>
                <a
                  href="https://www.pulumi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Pulumi
                </a>
              </li>
              <li>
                <a
                  href="https://git-scm.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Git
                </a>
              </li>
              <li>
                <a
                  href="https://www.docker.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Docker
                </a>
              </li>
              <li>
                <a
                  href="https://grafana.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Grafana
                </a>
              </li>
              <li>
                <a
                  href="https://prometheus.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Prometheus
                </a>
              </li>
            </ul>
          </div>
          <p className="text-lg mt-4">
            Thanks to the developers for making my life simpler.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Career;
