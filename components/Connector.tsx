import * as React from 'react';
import makeClass from 'classnames';
import { TweetTree } from 'types/twitter';

interface ConnectorProps {
  node: TweetTree;
  collapsed: boolean;
  onClick(): void;
}

const Connector: React.FC<ConnectorProps> = ({ node, collapsed, onClick }) => {
  const className = makeClass('connector', {
    collapsed: collapsed && node.children.length > 0
  });

  return (
    <div className={className} onClick={onClick}>
      <style jsx>{`
        .connector {
          border-color: rgb(237, 239, 241);
          border-radius: 2px;
          border-style: solid;
          border-width: 2px;
          bottom: 6px;
          content: '';
          display: block;
          left: 38px;
          position: absolute;
          width: 0;
          z-index: 1;
          top: 67px;
        }

        .connector.collapsed {
          border-color: rgb(187, 194, 201);
        }

        .connector:hover {
          border-color: rgb(29, 161, 242);
        }
      `}</style>
    </div>
  );
};

export default Connector;
