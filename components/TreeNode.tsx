import * as React from 'react';
import makeClass from 'classnames';
import { useSpring, animated } from 'react-spring';

import { TweetTree } from 'types/twitter';
import TweetComponent from '../components/TweetComponent';
import Connector from '../components/Connector';

interface TreeNodeProps {
  node: TweetTree;
  isRoot?: boolean;
}

const useInitialHeight = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const [initialHeight, setInitialHeight] = React.useState<number | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    setInitialHeight(ref.current.offsetHeight);
    // We only want this to run once! Hence the empty deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return initialHeight;
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, isRoot }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const baseHeight = useInitialHeight(ref);
  const props = useSpring({
    height: collapsed ? 0 : baseHeight || 'auto',
    opacity: collapsed ? 0 : 1
  });

  const toggleCollapsed = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCollapsed(!collapsed);
    e.stopPropagation();
  };

  const children = node.children.map(child => (
    <TreeNode key={child.module.id_str} node={child} />
  ));

  return (
    <div
      className={makeClass('wrapper', { 'no-border': isRoot })}
      onClick={toggleCollapsed}
    >
      <div className="label">
        <TweetComponent
          isRoot={isRoot}
          tweet={node.module}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <animated.div
        ref={ref}
        style={{
          ...props,
          visibility: props.opacity.interpolate(o =>
            o === 0 ? 'hidden' : 'visible'
          ),
          marginLeft: 40,
          maxHeight: 'fit-content'
        }}
      >
        {children}
      </animated.div>

      <Connector node={node} collapsed={collapsed} onClick={toggleCollapsed} />

      <style jsx>{`
        .wrapper {
          overflow: hidden;
          position: relative;
        }

        .label {
          align-items: baseline;
          display: flex;
          margin-left: 12px;
        }
      `}</style>
    </div>
  );
};

export default TreeNode;
