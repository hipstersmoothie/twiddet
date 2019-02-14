import jwtDecode from 'jwt-decode';
import Cookie from 'js-cookie';
import { IncomingMessage } from 'http';

export const setToken = (idToken: string, accessToken: string) => {
  if (!process.browser) {
    return;
  }

  Cookie.set('user', jwtDecode(idToken));
  Cookie.set('idToken', idToken);
  Cookie.set('accessToken', accessToken);
};

export const unsetToken = () => {
  if (!process.browser) {
    return;
  }

  Cookie.remove('idToken');
  Cookie.remove('accessToken');
  Cookie.remove('user');

  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now().toString());
};

export const getUserFromServerCookie = (req?: IncomingMessage) => {
  if (!req || !req.headers || !req.headers.cookie) {
    return undefined;
  }

  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('idToken='));

  if (!jwtCookie) {
    return undefined;
  }

  const jwt = jwtCookie.split('=')[1];
  return jwtDecode(jwt);
};

export const getUserFromLocalCookie = () => {
  return Cookie.getJSON('user');
};
