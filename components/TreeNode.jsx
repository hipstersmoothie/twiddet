"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const react_treeview_1 = __importDefault(require("react-treeview"));
const TweetComponent_1 = __importDefault(require("../components/TweetComponent"));
const Connector_1 = __importDefault(require("../components/Connector"));
const TreeNode = ({ node, isRoot }) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const toggleCollapsed = () => setCollapsed(!collapsed);
    return (<div className="tree-node">
      <react_treeview_1.default treeViewClassName={classnames_1.default({ 'no-border': isRoot })} nodeLabel={<TweetComponent_1.default isRoot={isRoot} tweet={node.module} collapsed={collapsed} setCollapsed={setCollapsed}/>} collapsed={collapsed} style={node.children.length > 0 ? {} : { opacity: 0 }} onClick={toggleCollapsed}>
        {node.children.map(child => (<TreeNode key={child.module.id_str} node={child}/>))}
      </react_treeview_1.default>
      <Connector_1.default node={node} collapsed={collapsed} onClick={toggleCollapsed}/>

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
    </div>);
};
exports.default = TreeNode;
//# sourceMappingURL=TreeNode.jsx.map