declare module 'react-ui-tree' {
  export interface TreeNode<T> {
    module: T;
    children: TreeNode<T>[];
  }

  interface TreeProps {
    renderNode(node: TreeNode<T>): React.ReactNode;
    tree: TreeNode<T>;
  }

  const Tree: React.FC<TreeProps>;

  export default Tree;
}
