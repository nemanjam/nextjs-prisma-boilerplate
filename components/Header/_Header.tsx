import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { Routes } from 'lib-client/constants';
import { getAvatarPath } from 'utils';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();
  const loading = status === 'loading';

  let left = (
    <div className="left">
      <Link href={Routes.SITE.HOME}>
        <a className="bold" data-active={isActive('/')}>
          Feed
        </a>
      </Link>

      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (loading) {
    left = (
      <div className="left">
        <Link href={Routes.SITE.HOME}>
          <a className="bold" data-active={isActive('/')}>
            Feed
          </a>
        </Link>

        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          .left a[data-active='true'] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>

        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href={Routes.SITE.LOGIN}>
          <a>Log in</a>
        </Link>
        <Link href={Routes.SITE.REGISTER}>
          <a>Register</a>
        </Link>

        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href={Routes.SITE.HOME}>
          <a className="bold" data-active={isActive(Routes.SITE.HOME)}>
            Feed
          </a>
        </Link>

        <Link
          href={{
            pathname: '/[username]',
            query: { username: session.user.username },
          }}
        >
          <a className="bold" data-active={isActive(`/${session.user.username}`)}>
            Profile
          </a>
        </Link>

        <Link href={Routes.SITE.DRAFTS}>
          <a data-active={isActive(Routes.SITE.DRAFTS)}>My drafts</a>
        </Link>

        <Link href={Routes.SITE.SETTINGS}>
          <a data-active={isActive(Routes.SITE.SETTINGS)}>Settings</a>
        </Link>

        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          .left a[data-active='true'] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <div className="p-temp">
          <img src={getAvatarPath(session.user)} width="50" height="50" />
          {session.user.name} ({session.user.email})
        </div>
        <Link href={Routes.SITE.CREATE}>
          <button>
            <a>New post</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>

        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          .p-temp {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          button {
            border: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <nav>
      <span className="hello">test</span>
      {left}
      {right}

      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;
