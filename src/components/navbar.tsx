import Link from 'next/link';
import HackthonLogo from '../images/HackthonProjectLogo.png';
import Image from 'next/image';

const navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/">Main</Link>
            </li>
            <li>
              <Link href="/cognicy">Cognicy</Link>
            </li>
            <li>
              <Link href="/developers">Developers</Link>
            </li>
          </ul>
        </div>
        <Image
          src={HackthonLogo}
          alt="Hackthon Logo"
          width={200}
          height={200}
        />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Main</Link>
          </li>
          <li>
            <Link href="/cognicy">Cognicy</Link>
          </li>
          <li>
            <Link href="/developers">Developers</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="flex items-center space-x-4">
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
};

export default navbar;
