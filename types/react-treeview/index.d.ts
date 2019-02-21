declare module 'react-treeview' {
  export interface TreeNode<T> {
    module: T;
    children: TreeNode<T>[];
  }

  interface TreeProps {
    nodeLabel: React.ReactNode;
    collapsed: boolean;
    treeViewClassName: string;
    style: React.StyleHTMLAttributes;
    onClick(): void;
  }

  const Tree: React.FC<TreeProps>;

  export default Tree;
}
