import * as React from 'react';
import makeClass from 'classnames';
import { useSpring, animated } from 'react-spring';

import { TweetTree } from 'types/twitter';
import TweetComponent from '../components/TweetComponent';
import Connector from '../components/Connector';

interface TreeViewProps {
  className: string;
  indent?: number;
  label: React.ReactNode;
  collapsed: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  className,
  onClick,
  children,
  label,
  collapsed,
  indent = 40
}) => {
  const [baseHeight, setBaseHeight] = React.useState<number | undefined>(
    undefined
  );
  const ref = React.useRef<HTMLDivElement>(null);
  const props = useSpring({ height: collapsed ? 0 : baseHeight || 'auto' });

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    setBaseHeight(ref.current.offsetHeight);
  }, []);

  return (
    <div className={makeClass(className, 'wrapper')} onClick={onClick}>
      <div className="label">{label}</div>

      <div ref={ref} style={{ marginLeft: indent, overflow: 'hidden' }}>
        {baseHeight === undefined ? (
          children
        ) : (
          <animated.div style={{ ...props, maxHeight: 'fit-content' }}>
            {children}
          </animated.div>
        )}
      </div>

      <style jsx>{`
        .label {
          align-items: baseline;
          display: flex;
          margin-left: 12px;
        }
      `}</style>
    </div>
  );
};

interface TreeNodeProps {
  node: TweetTree;
  isRoot?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isRoot }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapsed = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCollapsed(!collapsed);
    e.stopPropagation();
  };

  return (
    <div className="tree-node">
      <TreeView
        className={makeClass({ 'no-border': isRoot })}
        label={
          <TweetComponent
            isRoot={isRoot}
            tweet={node.module}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        }
        collapsed={collapsed}
        onClick={toggleCollapsed}
      >
        {node.children.map(child => (
          <TreeNode key={child.module.id_str} node={child} />
        ))}
      </TreeView>
      <Connector node={node} collapsed={collapsed} onClick={toggleCollapsed} />

      <style jsx>{`
        .tree-node {
          overflow: visible;
          position: relative;
        }

        :global(.tree-view_arrow) {
          opacity: 0;
        }

        :global(.tree-view_item) {
          align-items: baseline;
          display: flex;
        }

        :global(.tree-view_item) > :global(*) {
          display: inline;
        }

        .tree-node :global(.tree-view_children) {
          margin-left: 40px;
        }
      `}</style>
    </div>
  );
};

export default TreeNode;
