import React, { useState } from 'react';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { Routes } from 'lib-client/constants';
import { getAvatarPath } from 'utils';
import { FaCat } from 'react-icons/fa';
import { RiMenuLine } from 'react-icons/ri';
import Dropdown from 'components/Dropdown';
import { useViewport } from 'components/hooks';

const isActive: (router: NextRouter, pathname: string) => boolean = (router, pathname) =>
  router.pathname === pathname;

interface ItemsArgs {
  router: NextRouter;
  session: Session;
  onHamburgerClick?: () => void;
  mobileMenuOpen?: boolean;
  isGetDropdownItems?: boolean;
}

const getAllItems = ({
  router,
  session,
  onHamburgerClick,
  mobileMenuOpen,
  isGetDropdownItems,
}: ItemsArgs) => ({
  home: (
    <Link href={Routes.SITE.HOME}>
      <a className="bold" data-active={isActive(router, Routes.SITE.HOME)}>
        Home
      </a>
    </Link>
  ),
  profile: session && (
    <Link
      href={{
        pathname: '/[username]',
        query: { username: session.user.username },
      }}
    >
      <a className="bold" data-active={isActive(router, `/${session.user.username}`)}>
        Profile
      </a>
    </Link>
  ),
  drafts: (
    <Link href={Routes.SITE.DRAFTS}>
      <a data-active={isActive(router, Routes.SITE.DRAFTS)}>My drafts</a>
    </Link>
  ),
  settings: (
    <Link href={Routes.SITE.SETTINGS}>
      <a data-active={isActive(router, Routes.SITE.SETTINGS)}>Settings</a>
    </Link>
  ),
  logout: (
    <button onClick={() => signOut()}>
      <a>Log out</a>
    </button>
  ),
  login: (
    <Link href={Routes.SITE.LOGIN}>
      <a>Log in</a>
    </Link>
  ),
  register: (
    <Link href={Routes.SITE.REGISTER}>
      <a>Register</a>
    </Link>
  ),
  // prevent recursion
  avatar: !isGetDropdownItems && session && (
    <Dropdown
      items={getDropdownItems({ router, session, onHamburgerClick, mobileMenuOpen })}
    >
      <img src={getAvatarPath(session.user)} width="50" height="50" />
    </Dropdown>
  ),
  hamburger: (
    <button
      type="button"
      aria-label="Toggle mobile menu"
      onClick={onHamburgerClick}
      className="rounded md:hidden focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50"
    >
      <RiMenuLine
        className={`transition duration-100 ease h-8 w-8 ${
          mobileMenuOpen ? 'transform rotate-90' : ''
        }`}
      />
    </button>
  ),
});

// loged in
// left desktop navitems: home, profile, drafts
// right desktop: avatar
// left mobile: none
// dropdown desktop: settins, logout
// dropdown mobile: no dropdown

// loged out
// left desktop: home
// right: login, register
// left mobile: none

// left, loggedin, mobile, dropdown

const objectFilter = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));

interface FilterItemsArgs extends ItemsArgs {
  argsArray: string[];
}

const filterAllItems = ({ argsArray, ...restArgs }: FilterItemsArgs) =>
  argsArray?.length > 0
    ? Object.values(
        objectFilter(getAllItems(restArgs), ([key, value]) => argsArray.includes(key))
      )
    : [];

interface GetNavLinksArgs extends ItemsArgs {
  isMobile: boolean;
}

const getLeftNavLinks = ({ router, session, isMobile }: GetNavLinksArgs) => {
  const leftNavLinksDesktopLoggedIn = ['home', 'profile', 'drafts'];
  const leftNavLinksMobile = [];
  const leftNavLinksDesktopLoggedOut = ['home'];

  let argsArray = [];
  if (!isMobile && session) argsArray = leftNavLinksDesktopLoggedIn;
  if (!isMobile && !session) argsArray = leftNavLinksDesktopLoggedOut;
  if (isMobile) argsArray = leftNavLinksMobile;

  return filterAllItems({ router, session, argsArray });
};

const getRightNavLinks = ({
  router,
  session,
  isMobile,
  onHamburgerClick,
  mobileMenuOpen,
}: GetNavLinksArgs) => {
  const rightNavLinksDesktopLoggedIn = ['avatar'];
  const rightNavLinksMobile = ['hamburger'];
  const rightNavLinksDesktopLoggeOut = ['login', 'register'];

  let argsArray = [];
  if (!isMobile && session) argsArray = rightNavLinksDesktopLoggedIn;
  if (!isMobile && !session) argsArray = rightNavLinksDesktopLoggeOut;
  if (isMobile) argsArray = rightNavLinksMobile;

  return filterAllItems({ router, session, argsArray, onHamburgerClick, mobileMenuOpen });
};

const getMobileNavLinks = (args: GetNavLinksArgs) => {
  const navLinksMobileLoggedIn = [
    'home',
    'profile',
    'drafts',
    'settings',
    'avatar',
    'logout',
  ];

  const navLinksMobileLoggedOut = ['home', 'login', 'register'];
};

function getDropdownItems(args: ItemsArgs) {
  const dropdownDesktopLoggedIn = ['settings', 'logout'];
  const dropdownMobile = [];
  const dropdownLoggedOut = [];

  let argsArray = [];
  if (args?.session) argsArray = dropdownDesktopLoggedIn;
  if (!args?.session) argsArray = dropdownLoggedOut;

  return filterAllItems({ ...args, argsArray, isGetDropdownItems: true });
}

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { width } = useViewport();
  const isMobile = width < 768;

  const { data: session, status } = useSession();
  const _onHamburgerClick = () => setMobileMenuOpen(!mobileMenuOpen);

  const mobileMenu =
    mobileMenuOpen &&
    getAllNavLinks({
      router,
      session,
      isMobile,
      mobileMenuOpen,
      onHamburgerClick: _onHamburgerClick,
    });

  console.log('mobileMenu', mobileMenu);

  return (
    <div className="bg-gradient-to-r from-blue-300 to-blue-100">
      <DesktopNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        session={session}
        router={router}
        isMobile={isMobile}
      />
      {mobileMenuOpen && <MobileMenu>{mobileMenu}</MobileMenu>}
    </div>
  );
};

const DesktopNavbar = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  session,
  router,
  isMobile,
}) => {
  const _onHamburgerClick = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="flex justify-between h-14 px-4">
      <div className="flex">
        <div className="flex items-center gap-2">
          <FaCat className="h-10 w-10 text-violet-500" />
          <a
            href="#home"
            className="text-xl font-bold no-underline text-gray-800 hover:text-gray-600"
          >
            NP Boilerplate
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-6 h-full">
          {getLeftNavLinks({ router, session, isMobile })}
        </nav>
      </div>

      {/* render avatar */}
      {!isMobile &&
        session &&
        getAllItems({
          router,
          session,
        })?.avatar}

      {/* render hamburger */}
      {isMobile &&
        getAllItems({
          router,
          session,
          mobileMenuOpen,
          onHamburgerClick: _onHamburgerClick,
        })?.hamburger}

      {/* render login/register */}
      {!session &&
        getRightNavLinks({
          router,
          session,
          isMobile,
          mobileMenuOpen,
          onHamburgerClick: _onHamburgerClick,
        })}
    </div>
  );
};

const MobileMenu = ({ children }) => (
  <nav className="p-4 flex flex-col space-y-3 md:hidden">{children}</nav>
);

export default Navbar;
