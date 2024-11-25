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
                <p>Course list coming soon...</p>
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
