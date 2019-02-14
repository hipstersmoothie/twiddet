import React from 'react';

import NotAuthorized from '../components/NotAuthorized';
import defaultPage from './defaultPage';
import { NextComponentType, NextContext } from 'next';

interface SecurePageProps {
  isAuthenticated: boolean;
}

const securePageHoc = <P extends object>(Page: NextComponentType<P>) =>
  class SecurePage extends React.Component<P & SecurePageProps> {
    static getInitialProps(ctx: NextContext) {
      return (Page.getInitialProps ? Page.getInitialProps(ctx) : {}) as P &
        SecurePageProps;
    }

    render() {
      if (!this.props.isAuthenticated) {
        return <NotAuthorized />;
      }

      return <Page {...this.props} />;
    }
  };

export default <P extends object>(Page: NextComponentType<P>) =>
  defaultPage(securePageHoc(Page));
