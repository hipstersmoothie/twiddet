import * as React from 'react';
import makeClass from 'classnames';
import TreeView from 'react-treeview';

import { TweetTree } from 'types/twitter';
import TweetComponent from '../components/TweetComponent';
import Connector from '../components/Connector';

interface TreeNodeProps {
  node: TweetTree;
  isRoot?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isRoot }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="tree-node">
      <TreeView
        treeViewClassName={makeClass({ 'no-border': isRoot })}
        nodeLabel={
          <TweetComponent
            isRoot={isRoot}
            tweet={node.module}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        }
        collapsed={collapsed}
        style={node.children.length > 0 ? {} : { opacity: 0 }}
        onClick={toggleCollapsed}
      >
        {node.children.map(child => (
          <TreeNode key={child.module.id_str} node={child} />
        ))}
      </TreeView>
      <Connector node={node} collapsed={collapsed} onClick={toggleCollapsed} />

      <style jsx>{`
        .tree-node {
          position: relative;
          overflow: visible;
        }

        :global(.tree-view_arrow) {
          opacity: 0;
        }

        .tree-node :global(.tree-view_children) {
          margin-left: 40px;
        }

        :global(.tree-view_item) {
          display: flex;
          align-items: baseline;
        }

        :global(.tree-view_item) > :global(*) {
          display: inline;
        }
      `}</style>
    </div>
  );
};

export default TreeNode;
