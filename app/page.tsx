"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RESUME from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Intro Section */}
      <div className="flex items-center gap-6 p-6">
        <Avatar className="size-20">
          <AvatarImage src={RESUME.avatar_path} alt="Avatar" />
          <AvatarFallback>
            {RESUME.name
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl">{RESUME.name}</h1>
          <p className="mt-1 opacity-70">{RESUME.bio.intro}</p>
        </div>
      </div>

      {/* About Me Section */}
      <div className="px-6 pt-4 pb-6">
        <h2 className="text-sm tracking-wide">About</h2>
        <div className="mt-2.5 opacity-70 space-y-3 text-sm">
          <p>
            I'm passionate about building systems that solve real problems. My
            approach is guided by "rejecting artificial bounds" - exceptional
            versatility is possible when you focus on continuous learning and
            building.
          </p>
          <p>
            I've been programming since I was 9, starting with QBasic. I enjoy
            tackling challenging, often obscure problems. I believe in
            contributing to communities and creating tools that help people work
            more effectively.
          </p>
          <p>
            Currently doing research on real-time guarantees for edge computing.
          </p>
          <p>
            Also :p other than this, I'm a huge cinephile and music nerd. I play
            guitar and the Blues - my favourite artist is John Mayer. I'm still
            unsure about my favourite director though (Wes Anderson seems pick
            me lol maybe Imtiaz Ali).
          </p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="px-6 pt-4 pb-6">
        <h2 className="text-sm tracking-wide">Work Experience</h2>
        <div className="mt-2.5 space-y-6">
          {RESUME.experience.map((experience) => (
            <div key={experience.company} className="grid grid-cols-2">
              <div className="text-sm">
                <p className="text-muted-foreground">
                  {experience.start_date} — {experience.end_date || "Present"}
                </p>
              </div>
              {/* <Link
                href={experience.company_website}
                target="_blank"
                className="size-10 flex items-center justify-center bg-background border rounded-md p-2.5 flex-shrink-0 shadow-sm"
              >
                <div className="size-10 flex items-center justify-center bg-background border rounded-md p-2.5 flex-shrink-0 shadow-sm">
                  <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain flex items-center justify-center">
                    {experience.icon}
                  </div>
                </div>
              </Link> */}
              <div className="text-sm space-y-2">
                <Link
                  href={experience.company_website}
                  target="_blank"
                  className="flex gap-1"
                >
                  <h3 className="">
                    {experience.role} at {experience.company}{" "}
                  </h3>
                  <ExternalArrow className="size-3 mt-0.5" />
                </Link>
                <div className="opacity-70 space-y-2">
                  <p>{experience.location}</p>
                  <ul className="list-disc list-outside pl-4 text-wrap space-y-2">
                    {experience.description.map((description) => (
                      <li key={description}>{description}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="px-6 pt-4 pb-6">
        <h2 className="text-sm tracking-wide">Education</h2>
        <div className="mt-2.5">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div>
                  <h3 className="font-medium tracking-tight">
                    {RESUME.education.institution}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {RESUME.education.degree}, {RESUME.education.major}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p>
                  {RESUME.education.start_year} - {RESUME.education.end_year}
                </p>
                <p className="text-muted-foreground mt-0.5">
                  {RESUME.education.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-6">
        <h2 className="text-sm tracking-wide">Open Source Work</h2>
        <div className="mt-2.5">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div>
                  <h3 className="font-medium tracking-tight">
                    {RESUME.education.institution}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {RESUME.education.degree}, {RESUME.education.major}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p>
                  {RESUME.education.start_year} - {RESUME.education.end_year}
                </p>
                <p className="text-muted-foreground mt-0.5">
                  {RESUME.education.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-6">
        <h2 className="text-sm tracking-wide">Awards</h2>
        <div className="mt-2.5">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div>
                  <h3 className="font-medium tracking-tight">
                    {RESUME.education.institution}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {RESUME.education.degree}, {RESUME.education.major}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p>
                  {RESUME.education.start_year} - {RESUME.education.end_year}
                </p>
                <p className="text-muted-foreground mt-0.5">
                  {RESUME.education.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-6">
        <h2 className="text-sm tracking-wide">Projects</h2>
        <div className="mt-2.5">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div>
                  <h3 className="font-medium tracking-tight">
                    {RESUME.education.institution}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {RESUME.education.degree}, {RESUME.education.major}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p>
                  {RESUME.education.start_year} - {RESUME.education.end_year}
                </p>
                <p className="text-muted-foreground mt-0.5">
                  {RESUME.education.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-6">
        <h2 className="text-sm tracking-wide">Links</h2>
        <div className="mt-2.5">
          <div className="grid grid-cols-2 gap-y-3 text-sm max-w-sm">
            {RESUME.links.map((link) => (
              <>
                <p className="text-muted-foreground">{link.name}</p>
                <div className="flex items-start gap-1">
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.text}
                  </Link>
                  <ExternalArrow className="mt-0.5 size-3" />
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const ExternalArrow = ({ className }: { className?: string }) => (
  <svg
    className={cn(className)}
    viewBox="0 0 12 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
      fill="var(--grey1)"
    ></path>
  </svg>
);
