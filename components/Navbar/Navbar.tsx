import React, { useState } from 'react';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { FaCat } from 'react-icons/fa';
import { RiMenuLine } from 'react-icons/ri';
import { withBem } from 'utils/bem';
import { Routes } from 'lib-client/constants';
import { getAvatarPath } from 'utils';
import Dropdown from 'components/Dropdown';
import { useViewport } from 'components/hooks';

const isActive: (router: NextRouter, pathname: string) => boolean = (router, pathname) =>
  router.asPath === pathname;

interface ItemsArgs {
  router: NextRouter;
  session: Session;
  onHamburgerClick?: () => void;
  mobileMenuOpen?: boolean;
  isGetDropdownItems?: boolean;
}

interface FilterItemsArgs extends ItemsArgs {
  argsArray: string[];
}

const b = withBem('navbar');

const getAllItems = ({
  router,
  session,
  onHamburgerClick,
  mobileMenuOpen,
  isGetDropdownItems,
}: ItemsArgs) => ({
  home: (
    <Link key="home" href={Routes.SITE.HOME}>
      <a className={b('nav-link', { active: isActive(router, Routes.SITE.HOME) })}>
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
      <a
        className={b('nav-link', {
          active: isActive(router, `/${session.user.username}/`),
        })}
      >
        Profile
      </a>
    </Link>
  ),
  create: (
    <Link key="create" href={Routes.SITE.CREATE}>
      <a className={b('nav-link', { active: isActive(router, Routes.SITE.CREATE) })}>
        Create
      </a>
    </Link>
  ),
  drafts: (
    <Link key="drafts" href={Routes.SITE.DRAFTS}>
      <a className={b('nav-link', { active: isActive(router, Routes.SITE.DRAFTS) })}>
        Drafts
      </a>
    </Link>
  ),
  settings: (
    <Link key="settings" href={Routes.SITE.SETTINGS}>
      <a className={b('nav-link', { active: isActive(router, Routes.SITE.SETTINGS) })}>
        Settings
      </a>
    </Link>
  ),
  logout: (
    <a
      key="logout"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        signOut();
      }}
      className={b('nav-link')}
    >
      Log out
    </a>
  ),
  login: (
    <Link key="login" href={Routes.SITE.LOGIN}>
      <a className={b('nav-link')}>Log in</a>
    </Link>
  ),
  register: (
    <Link key="register" href={Routes.SITE.REGISTER}>
      <a className={b('nav-link')}>Register</a>
    </Link>
  ),
  // prevent recursion
  avatar: !isGetDropdownItems && session && (
    <Dropdown
      key="avatar"
      items={getDropdownItems({ router, session, onHamburgerClick, mobileMenuOpen })}
    >
      <img className={b('avatar')} src={getAvatarPath(session.user)} />
    </Dropdown>
  ),
  justAvatar: session && (
    <img
      className={b('just-avatar')}
      key="justAvatar"
      src={getAvatarPath(session.user)}
      width="50"
      height="50"
    />
  ),
  hamburger: (
    <button
      key="hamburger"
      type="button"
      aria-label="Toggle mobile menu"
      onClick={onHamburgerClick}
      className={b('hamburger')}
    >
      <RiMenuLine
        className={`transition duration-100 ease h-8 w-8 ${
          mobileMenuOpen ? 'transform rotate-90' : ''
        }`}
      />
    </button>
  ),
});

// helper methods
const objectFilter = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));

const filterAllItems = ({ argsArray, ...restArgs }: FilterItemsArgs) =>
  argsArray?.length > 0
    ? Object.values(
        objectFilter(getAllItems(restArgs), ([key, value]) => argsArray.includes(key))
      )
    : [];

// main nav definition
const navConfig = {
  leftNav: { loggedIn: ['home', 'profile', 'create', 'drafts'], loggedOut: ['home'] },
  rightNav: {
    loggedIn: {
      desktop: ['settings', 'avatar', 'logout'],
      mobile: ['settings', 'justAvatar', 'logout'],
    },
    loggedOut: ['login', 'register'],
  },
  dropdown: { loggedIn: ['settings', 'logout'], loggedOut: [] },
};

// getLeftNavLinks, getRightNavLinks, getDropdownItems
// don't care isMobile/desktop, but where they are called
const getLeftNavLinks = ({ router, session }: ItemsArgs) => {
  const argsArray = session ? navConfig.leftNav.loggedIn : navConfig.leftNav.loggedOut;

  return filterAllItems({ router, session, argsArray });
};

const getRightNavLinks = ({
  router,
  session,
  onHamburgerClick,
  mobileMenuOpen,
}: ItemsArgs) => {
  const argsArray = session
    ? mobileMenuOpen
      ? navConfig.rightNav.loggedIn.mobile
      : navConfig.rightNav.loggedIn.desktop
    : navConfig.rightNav.loggedOut;

  return filterAllItems({ router, session, argsArray, onHamburgerClick, mobileMenuOpen });
};

const getAllNavLinks = (args: ItemsArgs) => {
  return getLeftNavLinks(args).concat(getRightNavLinks(args));
};

function getDropdownItems(args: ItemsArgs) {
  const argsArray = args?.session
    ? navConfig.dropdown.loggedIn
    : navConfig.dropdown.loggedOut;

  return filterAllItems({ ...args, argsArray, isGetDropdownItems: true });
}

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { width } = useViewport();
  const isMobile = width < 768;

  const { data: session, status } = useSession();
  const _onHamburgerClick = () => setMobileMenuOpen(!mobileMenuOpen);

  const args = {
    router,
    session,
    mobileMenuOpen,
    onHamburgerClick: _onHamburgerClick,
  };

  const rightNav = !isMobile && !session && getRightNavLinks(args);
  const leftNav = getLeftNavLinks(args);
  const avatar = !isMobile && session && getAllItems(args)?.avatar;
  const hamburger = isMobile && getAllItems(args)?.hamburger;
  const mobileNav = getAllNavLinks(args);

  return (
    <header className={b()}>
      {/* desktop navbar */}
      <div className={b('desktop')}>
        <div className={b('left-wrapper')}>
          <div className={b('brand')}>
            <Link href={Routes.SITE.HOME}>
              <a className={b('brand-link')}>
                <FaCat className={b('logo')} />
                <span className={b('brand-text')}>NP Boilerplate</span>
              </a>
            </Link>
          </div>
          <div className={b('left-nav')}>{leftNav}</div>
        </div>
        <div className={b('right-nav')}>
          {avatar}
          {rightNav}
          {hamburger}
        </div>
      </div>

      {/* mobile menu */}
      {mobileMenuOpen && <nav className={b('mobile-nav')}>{mobileNav}</nav>}
    </header>
  );
};

export default Navbar;
