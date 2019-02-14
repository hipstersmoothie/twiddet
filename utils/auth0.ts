import auth0 from 'auth0-js';
import config from '../config.json';

const getAuth0 = () => {
  return new auth0.WebAuth({
    clientID: config.AUTH0_CLIENT_ID,
    domain: config.AUTH0_CLIENT_DOMAIN
  });
};

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

const getOptions = () => {
  return {
    responseType: 'token id_token',
    redirectUri: `${getBaseUrl()}/auth/signed-in`,
    scope: 'openid profile email'
  };
};

export const authorize = () => getAuth0().authorize(getOptions());
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() });
export const parseHash = (
  callback: auth0.Auth0Callback<
    auth0.Auth0DecodedHash | null,
    auth0.Auth0ParseHashError
  >
) => getAuth0().parseHash(callback);
