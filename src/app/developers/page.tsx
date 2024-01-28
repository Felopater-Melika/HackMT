import Navbar from '@/components/navbar';
import Image from 'next/image';
import githubLogo from '../../images/github-logo.png';
import Link from 'next/link';
import GroupPhoto from '../../images/20240127_172530.jpg';

import '../globals.css';


type Person = {
  name: string;
  picture?: string;
  role: string;
  website?: string;
  github?: string;
  linkedin?: string;
};

const developers: Person[] = [
  {
    name: 'Jainish Patel',
    role: "Front End",
    github: 'https://github.com/jainish1510',
    linkedin: 'http://linkedin.com/in/jainish-p-6b853524a'
  },
  {
    name: 'Steven Dew',
    role: 'Front End',
    github: 'https://github.com/StevenD2002',
    linkedin: 'www.linkedin.com/in/steven-dew'
  },
  {
    name: 'Mariam Abbas',
    role: 'Database',
    linkedin: 'https://www.linkedin.com/in/kwabena-fosuhene-595ba6129/'
  },
  {
    name: 'Daniel Powers',
    role: 'Designer'
  },
  {
    name: 'Kwabena Fosuhene',
    role: 'Front End Mentor',
    github: 'https://github.com/kof2c',
    linkedin: 'https://www.linkedin.com/in/kwabena-fosuhene-595ba6129/'
  },
  // backend
  {
    name: 'Zach Taylor',
    role: 'Front End',
    github: 'https://github.com/ZachTaylor2002',
    linkedin: 'https://www.linkedin.com/in/zachary-taylor-5371a124a'
  },
  {
    name: 'Einar Strandberg',
    role: 'Team Lead & Back End',
    github: 'https://github.com/einargs',
    linkedin: 'https://www.linkedin.com/in/einar-strandberg-358588299/',
    website: 'https://einargs.github.io'
  },
  {
    name: 'Wesley Mitchell',
    role: 'Database & API',
    linkedin: 'https://www.linkedin.com/in/wesley-mitchell-27078499/'
  },
  {
    name: 'James Vest',
    role: 'Back End'
  },
  {
    name: 'Ryan Huml',
    role: 'Back End'
  },
  {
    name: 'Felopater Melika',
    role: 'Full Stack & AI',
    website: "https://felopater.vercel.app",
    github: 'https://github.com/Felopater-Melika',
    linkedin: 'https://linkedin.com/in/Felopater-Melika'
  }
];

/*
    <div className="caro2">Steven Dew</div>
    <div className="caro2">Front-End</div>
    <div className="caro2">Zach Taylor</div>
    <div className="caro2">Front-End</div>
    <div className="caro2">Wesley Mitchell</div>
    <div className="caro2">Back-End</div>
    <div className="caro2">Daniel Powers</div>
    <div className="caro2">Design-Work</div>
    <div className="caro2">Mariam Abbas</div>
    <div className="caro2">Database-</div>
    <div className="caro2">Kwabena Fosuhene</div>
    <div className="caro2">Front-End</div>
    <div className="caro2">Ayush Kamath</div>
    <div className="caro2">Presentation-Work</div>
    <div className="caro2">Ryan Huml</div>
    <div className="caro2">Back-End</div>
    <div className="caro2">James Vest</div>
    <div className="caro2">Back-End</div>

  </div>
  
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Frontend Developers</h1>
        <ul>
          {frontendDevelopers.map((dev, index) => (
            <li key={index} className="mb-2">
              <p className="font-bold">{dev.name}</p>
              <div className="flex justify-center">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-2"
                >
                  GitHub
                </a>
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-2"
                >
                  LinkedIn
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Backend Developers</h1>
        <ul>
          {backendDevelopers.map((dev, index) => (
            <li key={index} className="mb-2">
              <p className="font-bold">{dev.name}</p>
              <div className="flex justify-center">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-2"
                >
                  GitHub
                </a>
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-2"
                >
                  LinkedIn
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
  */

const DevLink: React.FC<{url?: string, logo?: boolean, children: React.ReactNode}> = ({url, children, logo}) => {
  if (url) {
    return (
      <a href={url} className={"btn btn-primary" + (logo ? " btn-square" : "")}>{children}</a>
    );
  } else {
    return null;
  }
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <Image
        src={GroupPhoto}
        alt="Group Photo"
        className="w-1/2 mx-auto rounded-lg mt-8 mb-8"
      />
      <div className="w-full carousel carousel-center rounded-box p-10">
        {developers.map((dev, index) => (
          <div className="carousel-item card mx-6 bg-base-100 shadow-xl">
            <figure><img className="w-full overflow-clip h-96" src={dev.picture || "https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg"} alt="Picture of Developer" /></figure>
            <div className="card-body">
              <h2 className="card-title">{dev.name}</h2>
              <p>{dev.role}</p>
              
              <div className="card-actions justify-end">
                <DevLink logo url={dev.github}>
                  <Image
                    src={githubLogo}
                    alt="github logo"
                    height={50}
                    className="h-full w-full p-2"
                    // align the logo to the right side of the navbar
                  />
                </DevLink>
                <DevLink logo url={dev.linkedin}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </DevLink>
                <DevLink url={dev.website}>Website</DevLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer footer-center p-10 bg-primary text-primary-content">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="inline-block fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p className="font-bold">
            HackMT team 9<br />
            Providing reliable tech since 2024
          </p>
          <p>Copyright © 2024 - All right reserved</p>
        </aside>

        <div className="grid grid-flow-col gap-4">
          <Link href={'https://github.com/Felopater-Melika/HackMT'}>
            <Image
              src={githubLogo}
              alt="github logo"
              height={50}
              // align the logo to the right side of the navbar
              className="align-middle"
            />
          </Link>
        </div>
      </footer>
    </main>
  );
}
