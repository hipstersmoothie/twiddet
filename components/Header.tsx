import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const AppHeader = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

interface HeaderLinkProps {
  isActive: boolean;
}

const HeaderLink = styled.a<HeaderLinkProps>`
  margin-right: 20px;
  font-size: 14px;
  color: ${p => (p.isActive ? '#333' : '#999')};
  text-decoration: none;
  text-transform: uppercase;
  padding-top: 2px;
  padding-bottom: 2px;
  border-top: 1px solid ${p => (p.isActive ? '#333' : 'transparent')};
  border-bottom: 1px solid ${p => (p.isActive ? '#333' : 'transparent')};
  transition: color .25s;
  font-weight: isActive ? '600' : '400';

  &:hover {
    color: #333;
  }
`;

const links = [
  { href: '/', text: 'twiddet' },
  { href: '/auth/sign-in', text: 'Sign In', anonymousOnly: true },
  { href: '/auth/sign-off', text: 'Sign Off', authRequired: true }
];

const getAllowedLinks = (isAuthenticated: boolean) =>
  links
    .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
    .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly));

interface HeaderProps {
  isAuthenticated: boolean;
  currentUrl: string;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, currentUrl }) => (
  <AppHeader>
    {getAllowedLinks(isAuthenticated).map(l => (
      <Link prefetch key={l.href} href={l.href}>
        <HeaderLink isActive={currentUrl === l.href}>{l.text}</HeaderLink>
      </Link>
    ))}
  </AppHeader>
);

export default Header;
