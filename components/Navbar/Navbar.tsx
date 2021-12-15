import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { Routes } from 'lib-client/constants';
import { getAvatarPath } from 'utils';

import { FaCat } from 'react-icons/fa';
import { RiMenuLine } from 'react-icons/ri';

const pages = ['Products', 'Pricing', 'Login'];
const navLinks = pages.map((page) => (
  <a
    key={page}
    className="no-underline text-gray-800 font-semibold hover:text-gray-600"
    href={`#${page}`}
  >
    {page}
  </a>
));

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-300 to-blue-100">
      <DesktopNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {menuOpen && <MobileMenu>{navLinks}</MobileMenu>}
    </div>
  );
};

const DesktopNavbar = ({ menuOpen, setMenuOpen }) => (
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center">
      <FaCat className="h-10 w-10" />
      <a
        href="#home"
        className="text-xl font-bold no-underline text-gray-800 hover:text-gray-600 mr-8"
      >
        NP Boilerplate
      </a>
      <nav className="hidden md:block space-x-6">{navLinks}</nav>
    </div>
    <button
      type="button"
      aria-label="Toggle mobile menu"
      onClick={() => setMenuOpen(!menuOpen)}
      className="rounded md:hidden focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50"
    >
      <RiMenuLine
        className={`transition duration-100 ease h-8 w-8 ${
          menuOpen ? 'transform rotate-90' : ''
        }`}
      />
    </button>
  </div>
);

const MobileMenu = ({ children }) => (
  <nav className="p-4 flex flex-col space-y-3 md:hidden">{children}</nav>
);

export default Navbar;
