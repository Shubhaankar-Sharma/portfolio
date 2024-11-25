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
}) => {
  return (
    <div className="relative">
      {/* Timeline vertical line */}
      {endDate && (
        <div
          className="absolute left-0 w-px bg-secondary-text"
          style={{
            top: "2rem",
            bottom: 0,
            opacity: 0.2,
          }}
        />
      )}

      {/* Content */}
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-body flex items-center gap-4">
              {title}
              <img
                src={logo}
                alt={`${title} logo`}
                className="w-8 h-8 object-contain"
              />
            </h3>
            <p className="text-secondary-text">{subtitle}</p>
            {extraContent}
          </div>
          <div className="text-secondary-text">{startDate}</div>
        </div>

        {/* Children with vertical spacing */}
        <div className="pl-8 relative">
          {children}
          {endDate && (
            <div className="absolute right-0 top-full text-secondary-text pt-2">
              {endDate}
            </div>
          )}
        </div>
      </div>
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
    // course title and course code -> (description, instructor) in dropdown
    <div>
      <p className="text-body">
        {title} ({courseCode})
      </p>
      <Dropdown label="details">
      <div className="pl-4 text-secondary-text">
        <p className="text-xl">{description}</p>
        {instructor && (
          <p className="text-xl text-secondary-text">Instructor: {instructor}</p>
        )}
        </div>
      </Dropdown>
    </div>
  );
};

interface CourseListProps {
  courses: Map<string, CourseProps[]>;
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    // courses are mapped with their department name as the key, give dropdowns for each department
    <div className="space-y-4">
      {Array.from(courses.entries()).map(([department, courseList]) => (
        <Dropdown label={department}>
          {courseList.map((course) => (
            <Course {...course} />
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
      }
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
      }
    ]
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
          "Learnt about basic German language principles, including vocabulary, grammar, and pronunciation."
      },
      {
        title: "Introduction to Philosophy",
        courseCode: "PHIL 101",
        description:
          "Read philosophies around topics such as the nature and scope of human knowledge, the existence of God, and the relationship between mind and body. Philosophers studied: Socrates, Plato, Aristotle, Descartes, Hume, and Kant.",
      }
    ]
  ]
]);
const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-link hover:opacity-80 transition-opacity"
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
    <div className="max-w-4xl">
      <div className="mb-12 flex items-start justify-between">
        <h1>my career so far</h1>
        <a href="/resume.pdf" className="text-link hover:opacity-80">
          view resume
        </a>
      </div>

      <section className="mb-16">
        <h2 className="mb-8">Education</h2>
        <TimelineItem
          title="University of British Columbia"
          subtitle="Bachelor of Science"
          extraContent={
            <p className="text-secondary-text">
              Computer Science and Mathematics
            </p>
          }
          logo={ubclogo}
          startDate="Sep 2022"
          endDate="Apr 2026"
        >
          <div className="space-y-4">
            <div>
              <p className="text-secondary-text mb-2">Awards</p>
              <div className="space-y-1">
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
              <Dropdown label="click to explore courses i've taken">
                <CourseList courses={courses} />
              </Dropdown>
            </div>
          </div>
        </TimelineItem>
      </section>

      <section className="mb-16">
        <h2 className="mb-8">Experience</h2>
        <TimelineItem
          title="Horizon Blockchain Games Inc."
          subtitle="Backend Developer (Part-time)"
          logo={horizonlogo}
          startDate="Sep 2021"
          endDate="Sep 2024"
        >
          <div className="space-y-2">
            <Dropdown label="impact + projects">
              <p>Project details coming soon...</p>
            </Dropdown>
            <Dropdown label="things i learnt">
              <p>Learning details coming soon...</p>
            </Dropdown>
          </div>
        </TimelineItem>
      </section>
    </div>
  );
};
export default Career;
