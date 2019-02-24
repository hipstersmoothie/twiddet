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
const Connector = ({ node, collapsed, onClick }) => {
    const className = classnames_1.default('connector', {
        collapsed: collapsed && node.children.length > 0
    });
    return (<div className={className} onClick={onClick}>
      <style jsx>{`
        .connector {
          border-color: rgb(237, 239, 241);
          border-radius: 2px;
          border-style: solid;
          border-width: 2px;
          bottom: 6px;
          content: '';
          display: block;
          left: 35px;
          position: absolute;
          top: 67px;
          width: 0;
          z-index: 1;
        }

        .connector.collapsed {
          border-color: rgb(187, 194, 201);
        }

        .connector:hover {
          border-color: rgb(29, 161, 242);
        }
      `}</style>
    </div>);
};
exports.default = Connector;
//# sourceMappingURL=Connector.jsx.map