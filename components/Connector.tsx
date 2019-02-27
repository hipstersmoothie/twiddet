import * as React from 'react';
import makeClass from 'classnames';
import { TweetTree } from 'types/twitter';

interface ConnectorProps {
  node: TweetTree;
  collapsed: boolean;
  onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const Connector: React.FC<ConnectorProps> = ({ node, collapsed, onClick }) => {
  return (
    <div className="click-area" onClick={onClick}>
      <div
        className={makeClass('connector', {
          collapsed: collapsed && node.children.length > 0
        })}
        onClick={onClick}
      />
      <style jsx>{`
        .click-area {
          height: 100%;
          left: 25px;
          padding: 0 10px;

          position: absolute;
          top: 67px;
        }

        .connector {
          border-color: rgb(237, 239, 241);
          border-radius: 2px;
          border-style: solid;
          border-width: 2px;
          bottom: 6px;
          content: '';
          display: block;
          height: 100%;
          width: 0;
          z-index: 1;
        }

        .connector.collapsed {
          border-color: rgb(187, 194, 201);
        }

        .click-area:hover .connector {
          border-color: rgb(29, 161, 242);
        }
      `}</style>
    </div>
  );
};

export default Connector;
