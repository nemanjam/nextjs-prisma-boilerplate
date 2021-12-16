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
    <Link key="home" href={Routes.SITE.HOME}>
      <a className="bold" data-active={isActive(router, Routes.SITE.HOME)}>
        Home
      </a>
    </Link>
  ),
  profile: session && (
    <Link
      key="profile"
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
    <Link key="drafts" href={Routes.SITE.DRAFTS}>
      <a data-active={isActive(router, Routes.SITE.DRAFTS)}>My drafts</a>
    </Link>
  ),
  settings: (
    <Link key="settings" href={Routes.SITE.SETTINGS}>
      <a data-active={isActive(router, Routes.SITE.SETTINGS)}>Settings</a>
    </Link>
  ),
  logout: (
    <button key="logout" onClick={() => signOut()}>
      <a>Log out</a>
    </button>
  ),
  login: (
    <Link key="login" href={Routes.SITE.LOGIN}>
      <a>Log in</a>
    </Link>
  ),
  register: (
    <Link key="register" href={Routes.SITE.REGISTER}>
      <a>Register</a>
    </Link>
  ),
  // prevent recursion
  avatar: !isGetDropdownItems && session && (
    <Dropdown
      key="avatar"
      items={getDropdownItems({ router, session, onHamburgerClick, mobileMenuOpen })}
    >
      <img src={getAvatarPath(session.user)} width="50" height="50" />
    </Dropdown>
  ),
  justAvatar: session && (
    <img key="justAvatar" src={getAvatarPath(session.user)} width="50" height="50" />
  ),
  hamburger: (
    <button
      key="hamburger"
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

// getLeftNavLinks, getRightNavLinks, getDropdownItems
// don't care isMobile/desktop, but where they are called
const getLeftNavLinks = ({ router, session }: ItemsArgs) => {
  const leftNavLinksLoggedIn = ['home', 'profile', 'drafts'];
  const leftNavLinksLoggedOut = ['home'];

  const argsArray = session ? leftNavLinksLoggedIn : leftNavLinksLoggedOut;

  return filterAllItems({ router, session, argsArray });
};

const getRightNavLinks = ({
  router,
  session,
  onHamburgerClick,
  mobileMenuOpen,
}: ItemsArgs) => {
  const rightNavLinksLoggedIn = [
    'settings',
    mobileMenuOpen ? 'justAvatar' : 'avatar',
    'logout',
  ];
  const rightNavLinksLoggedOut = ['login', 'register'];

  const argsArray = session ? rightNavLinksLoggedIn : rightNavLinksLoggedOut;

  return filterAllItems({ router, session, argsArray, onHamburgerClick, mobileMenuOpen });
};

const getAllNavLinks = (args: ItemsArgs) => {
  return getLeftNavLinks(args).concat(getRightNavLinks(args));
};

function getDropdownItems(args: ItemsArgs) {
  const dropdownLoggedIn = ['settings', 'logout'];
  const dropdownLoggedOut = [];

  const argsArray = args?.session ? dropdownLoggedIn : dropdownLoggedOut;

  return filterAllItems({ ...args, argsArray, isGetDropdownItems: true });
}

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { width } = useViewport();
  const isMobile = width < 768;

  const { data: session, status } = useSession();
  const _onHamburgerClick = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="bg-gradient-to-r from-blue-300 to-blue-100">
      <DesktopNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        session={session}
        router={router}
        isMobile={isMobile}
      />
      {mobileMenuOpen && (
        <MobileMenu>
          {getAllNavLinks({
            router,
            session,
            mobileMenuOpen,
            onHamburgerClick: _onHamburgerClick,
          })}
        </MobileMenu>
      )}
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
          <Link href={Routes.SITE.HOME}>
            <a>
              <FaCat className="h-10 w-10 text-violet-500" />
              <span className="text-xl font-bold no-underline text-gray-800 hover:text-gray-600">
                NP Boilerplate
              </span>
            </a>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 h-full">
          {getLeftNavLinks({ router, session })}
        </nav>
      </div>

      {/* render avatar */}
      {!isMobile &&
        session &&
        getAllItems({
          router,
          session,
        })?.avatar}

      {/* render login/register */}
      {!isMobile &&
        !session &&
        getRightNavLinks({
          router,
          session,
          mobileMenuOpen,
          onHamburgerClick: _onHamburgerClick,
        })}

      {/* render hamburger */}
      {isMobile &&
        getAllItems({
          router,
          session,
          mobileMenuOpen,
          onHamburgerClick: _onHamburgerClick,
        })?.hamburger}
    </div>
  );
};

const MobileMenu = ({ children }) => (
  <nav className="p-4 flex flex-col space-y-3 md:hidden">{children}</nav>
);

export default Navbar;
