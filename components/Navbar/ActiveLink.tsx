import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { Children, ReactElement } from 'react';

type Props = {
  activeClassName: string;
  children: ReactElement<HTMLAnchorElement>;
  href: string;
  as?: string;
};

const ActiveLink: React.FC<Props> = ({ children, activeClassName, ...props }) => {
  const { asPath } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || '';

  const className =
    asPath === props.href || asPath === props.as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};

export default ActiveLink;

/*
https://github.dev/vercel/next.js/tree/canary/examples/active-class-name

<ActiveLink activeClassName="active" href="/about">
    <a className="nav-link">About</a>
</ActiveLink>

<ActiveLink activeClassName="active" href="/[slug]" as="/dynamic-route">
    <a className="nav-link">Dynamic Route</a>
</ActiveLink>

*/
