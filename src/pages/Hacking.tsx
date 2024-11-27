import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ProjectProps {
  title: string;
  description: string;
  link?: string;
  linkTitle?: string;
  images?: string[];
  ytvideos?: string[];
  year: number;
}

const Project: React.FC<ProjectProps> = ({ title, description, images, ytvideos, year }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleAnchorClick = () => {
    const id = title.toLowerCase().replace(/\s+/g, '-');
    window.location.hash = id;
  };

  const renderLink = (props: { href?: string; children?: React.ReactNode }) => {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
        {props.children}
      </a>
    );
  };

  return (
    <div id={title.toLowerCase().replace(/\s+/g, '-')} className="mb-8">
      <div className="flex items-center mb-2">
        <button onClick={handleAnchorClick} className="mr-2 text-gray-500 hover:text-gray-700">
          #
        </button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-xl text-gray-500 mb-4">{year}</p>
      <ReactMarkdown components={{ a: renderLink }} className="text-xl mb-4">
        {description}
      </ReactMarkdown>
      {/* horizontal scroll element with images and ytvideos embed */}
      <div className="flex overflow-x-auto">
        {/* allow users to open image in a bigger view */}
        {images && images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={title}
            className="w-64 h-64 mr-4 cursor-pointer object-cover"
            onClick={() => openModal(image)}
          />
        ))}
        {/* allow users to play the video in a modal */}
        {ytvideos && ytvideos.map((video, index) => (
          <iframe key={index} src={video} title={title} className="w-64 h-64 mr-4" />
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-white"
              onClick={closeModal}
            >
              &times;
            </button>
            <img src={selectedImage || ''} alt={title} className="max-w-full max-h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

let projects: ProjectProps[] = [
  {
    title: "Line Follower & Obstacle Avoider Robot",
    description: `
When I was 13, I built a robot using Arduino LDR sensors and ultrasonic sensors. The robot followed a black line and avoided objects in its path.

I have very terrible photos of this project since I was a kid :p.
    `,
    year: 2017,
    images: ["https://i.ibb.co/1bQzLWJ/line-follower-2.jpg", "https://i.ibb.co/09VYsrb/line-follower.jpg"]
  },
  {
    title: "Automatic Plant Watering System",
    description: `
I built an automatic plant watering system using Arduino. It measured the moisture level of the soil using conductivity and then used a motor to intake water from a bottle to water the plant.

Due to me being a 13-year-old, I again have very poor images.
    `,
    year: 2017,
    images: ["https://i.ibb.co/c3TpNmC/plant-watering.jpg"]
  },
  {
    title: "Online Multiplayer Ping Pong",
    description: `
I built a multiplayer ping pong game when I was 16, from scratch using just Pygame and inbuilt libraries in Python.

[Blog Post for the Project](https://medium.com/analytics-vidhya/basics-for-network-communication-on-python-af3f677af42c)
    `,
    year: 2020,
    link: "https://medium.com/analytics-vidhya/basics-for-network-communication-on-python-af3f677af42c",
    linkTitle: "Blog Post for the Project",
    images: ["https://miro.medium.com/v2/resize:fit:720/format:webp/1*30RoLEq__QUzH-Y7NgPVAA.png", "https://miro.medium.com/v2/resize:fit:720/format:webp/1*SsjVfEn2C9XWotEuyA9uBQ.png", "https://miro.medium.com/v2/resize:fit:720/format:webp/1*urY5gucYctSz_vEd-4maXw.png"]
  },
  {
    title: "goware/firewall",
    description: `
I wrote a middleware in Go for blocking IP ranges by inserting CIDR Blocks and searching IPs through those blocks. It by default blocks IPs from all major cloud providers.

[Github Repo](https://github.com/Shubhaankar-Sharma/firewall)
    `,
    year: 2021,
    link: "https://github.com/Shubhaankar-Sharma/firewall",
    linkTitle: "Github Repo",
  },
  {
    title: "Docs for Go-chi",
    description: `
Chi was my favourite routing library in Go, very minimal, and I recommended it to everyone. But it didn't have docs, so I wrote the official documentation hosted at go-chi.io.

Surprisingly, this got me a job at horizon.io.

[Docs here](https://go-chi.io)
    `,
    year: 2021,
    link: "https://go-chi.io",
    linkTitle: "Docs here",
  },
  {
    title: "Timathon - Website for hackathons hosted in the twt community",
    description: `
Built a website along with some community members in Django to host hackathons in the twt Discord server which has over 36k members. Hackathons were sponsored by repl.it and later on sponsored by algoexpert.

[Website](https://twtcodejam.net)
    `,
    year: 2021,
    link: "https://twtcodejam.net",
    linkTitle: "Website",
  },
  {
    title: "simpl.ai - Won 2nd at Hack the Valley UofT",
    description: `
The objective of our application is to devise an effective and efficient written transmission optimization scheme, by converting esoteric text into an exoteric format.

If you read the above sentence more than once and the word ‘huh?’ came to mind, then you got my point. Jargon causes a problem when you are talking to someone who doesn't understand it. Yet, we face obscure, vague texts every day - from 'text speak' to T&C agreements.

The most notoriously difficult to understand texts are legal documents, such as contracts or deeds. However, making legal language more straightforward would help people understand their rights better, be less susceptible to being punished or not being able to benefit from their entitled rights.

So we built an app that takes in documents and simplifies them to a more understandable format. We used TensorFlow and trained a BART model to do this.

[Devpost Link](https://devpost.com/software/simpl-ai)
    `,
    year: 2022,
    images: ["https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/254/914/datas/gallery.jpg", "https://i.postimg.cc/1RprSfYf/Tech-Diagram-drawio.png"],
    link: "https://devpost.com/software/simpl-ai",
    linkTitle: "Devpost Link",
  },
  {
    title: "goware/alerter - a simple alerting middleware + logger for go",
    description: `
I wrote a middleware + logger in Go that sends alerts and panics to Slack, Discord with nicely formatted stack traces.

[Github Repo](https://github.com/goware/alerter)
    `,
    year: 2022,
    link: "https://github.com/goware/alerter",
    linkTitle: "Github Repo",
  },
  {
    title: "goware/sed - sed the command line tool in go",
    description: `
I wrote a command line tool in Go that works like sed, but with Go regex. It can be used to replace text in files, and is very fast.

[Github Repo](https://github.com/goware/sed)
    `,
    year: 2022,
    link: "https://github.com/goware/sed",
    linkTitle: "Github Repo",
  },
  {
    title: "peersafe - a p2p end to end encrypted file storage app",
    description: `
We built a decentralized file storage app, that used Shamir key splitting to store private keys while still being decentralized. No longer works due to outdated dependencies.

[Website](https://peersafe.tech/)
    `,
    year: 2023,
    link: "https://peersafe.tech/",
    linkTitle: "Website",
    images: ["https://i.ibb.co/YXCLLQF/image.png", "https://i.ibb.co/3NjDc48/image.png"]
  },
  {
    title: "rfs-blockchain - a distributed file system on a blockchain",
    description: `
Built a distributed file system on a blockchain from scratch with no dependencies in Golang. This was a project in the CPSC 416 distributed systems course which I did for fun.

[Github Repo](https://github.com/Shubhaankar-Sharma/rfs-blockchain)
    `,
    year: 2023,
    link: "https://github.com/Shubhaankar-Sharma/rfs-blockchain",
    linkTitle: "Github Repo",
  },
  {
    title: "doomsday-messenger - Low Power Radio Mesh Network",
    description: `
Built a messenger using an RFM95 LoRa module and ESP32, that could send end to end encrypted messages to other devices in a mesh network.
This project is still in progress, the blog is updated regularly.

The final goal was to create a blackberry-esque messenger that could work without the internet and on just a solar panel.

Hook it to a ham radio and you have a doomsday messenger that can send messages across the world.

[Project Blog](https://streams.place/spongeboi/doomsday-messenger)

Demo video coming soon.
    `,
    year: 2024,
    link: "https://streams.place/spongeboi/doomsday-messenger",
    linkTitle: "Project Blog",
    images: ["https://i.ibb.co/j6Md6tc/image.png", "https://i.ibb.co/23HR3VS/image.png"]
  },
  {
    title: "go-chi/httplog/v2 - a http logger middleware for golang",
    description: `
Refactored the go-chi/httplog middleware to use slog, the new inbuilt Go library.

[Github](https://github.com/go-chi/httplog/pull/26)
    `,
    year: 2024,
    link: "https://github.com/go-chi/httplog/pull/26",
    linkTitle: "Github",
  }
];

const Hacking = () => {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  projects = projects.sort((a, b) => b.year - a.year);
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-8 text-4xl">Hacking</h1>
      <p className="text-xl mb-8">
        Hacking in this context means building projects - "hacking something together". <br />
        I found that when I built something I didn't know anything about, and its very obscure, there's a certain rush I got when I finally got it to work. <br />
        This is a log of all the projects and libraries I've worked on:
      </p>
      {projects.map((project, index) => (
        <Project key={index} {...project} />
      ))}
    </div>
  );
};

export default Hacking;
